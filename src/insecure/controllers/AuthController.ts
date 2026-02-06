import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../services/AuthService';
import { Logger } from '../../common/utils/Logger';
import { IController } from '../../common/interfaces/IController';

/**
 * Controller de autenticação INSEGURO
 * VULNERABILIDADES PROPOSITAIS:
 * - Sem validação de input
 * - Cookie sem flags de segurança
 * - Sem rate limiting
 * - Session ID simples sem validação forte
 */
export class InsecureAuthController implements IController {
  private authService: AuthService;
  private logger: Logger;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.logger = Logger.getInstance();
  }

  /**
   * Login inseguro
   * VULNERABILIDADE: Cookie sem HttpOnly, Secure, SameSite
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      
      // VULNERABILIDADE: Sem validação de input
      const user = await this.authService.login(email, password);
      
      // VULNERABILIDADE: Session ID simples, cookie sem flags
      const sessionId = require('crypto').randomUUID();
      res.cookie('session_id', sessionId, {
        // VULNERABILIDADE: Sem HttpOnly, sem Secure, sem SameSite
        // Permite que JavaScript acesse o cookie (XSS)
        // Cookie enviado em requisições cross-origin (CSRF)
      });

      this.logger.info('Insecure login', { userId: user.id, ip: req.ip });

      res.json({ 
        success: true, 
        user,
        sessionId // VULNERABILIDADE: Expor session ID no body também
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout inseguro
   */
  logout = async (req: Request, res: Response) => {
    res.clearCookie('session_id');
    res.json({ success: true, message: 'Logged out' });
  };
}

