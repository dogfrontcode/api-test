import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../../common/interfaces/IAuthRequest';
import { AuthService } from '../../services/AuthService';
import { Logger } from '../../common/utils/Logger';
import { IController } from '../../common/interfaces/IController';

/**
 * Controller de autenticação SEGURO
 * Implementa boas práticas de segurança
 */
export class SecureAuthController implements IController {
  private authService: AuthService;
  private logger: Logger;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.logger = Logger.getInstance();
  }

  /**
   * Login seguro com JWT
   * Input validado pelo middleware Zod
   * Rate limited pelo middleware
   */
  login = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      
      const user = await this.authService.login(email, password);
      
      // Gerar tokens seguros
      const accessToken = this.authService.generateAccessToken(user.id, user.email, user.role);
      const refreshToken = await this.authService.generateRefreshToken(user.id);

      this.logger.info('Secure login', { userId: user.id, ip: req.ip });

      res.json({
        success: true,
        accessToken,
        refreshToken,
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        }
      });
    } catch (error) {
      this.logger.error('Login failed', { email: req.body.email, ip: req.ip });
      next(error);
    }
  };

  /**
   * Refresh token - gera novo access token
   */
  refresh = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      
      const accessToken = await this.authService.refreshAccessToken(refreshToken);

      this.logger.info('Token refreshed', { ip: req.ip });

      res.json({
        success: true,
        accessToken
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Re-autenticação (step-up) para operações sensíveis
   */
  reauth = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { password } = req.body;
      const user = req.user!;

      // Verificar senha novamente
      await this.authService.login(user.email, password);

      // Gerar token temporário de curta duração
      const stepUpToken = this.authService.generateStepUpToken(user.userId);

      this.logger.info('Step-up authentication', { userId: user.userId, ip: req.ip });

      res.json({ 
        success: true, 
        stepUpToken 
      });
    } catch (error) {
      this.logger.warn('Step-up authentication failed', { 
        userId: req.user?.userId, 
        ip: req.ip 
      });
      next(error);
    }
  };

  /**
   * Logout - invalida refresh token
   */
  logout = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      
      if (refreshToken) {
        await this.authService.logout(refreshToken);
      }

      this.logger.info('Secure logout', { userId: req.user?.userId, ip: req.ip });

      res.json({ 
        success: true, 
        message: 'Logged out successfully' 
      });
    } catch (error) {
      next(error);
    }
  };
}

