import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../../common/interfaces/IAuthRequest';
import { AuthService } from '../../services/AuthService';
import { UnauthorizedError } from '../../common/errors';

/**
 * Middleware de autenticação SEGURO
 * Valida JWT do header Authorization
 */
export class SecureAuthMiddleware {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Valida access token JWT
   */
  authenticate = () => {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new UnauthorizedError('Missing or invalid authorization header');
        }

        const token = authHeader.substring(7); // Remove "Bearer "
        const decoded = this.authService.verifyAccessToken(token);
        
        // Adicionar informações do usuário na requisição
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role
        };

        next();
      } catch (error) {
        next(error);
      }
    };
  };

  /**
   * Valida step-up token para operações sensíveis
   */
  requireStepUp = () => {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
      try {
        const stepUpToken = req.headers['x-step-up-token'] as string;
        
        if (!stepUpToken) {
          throw new UnauthorizedError('Step-up authentication required');
        }

        const decoded = this.authService.verifyStepUpToken(stepUpToken);
        
        // Verificar se step-up token pertence ao usuário autenticado
        if (decoded.userId !== req.user?.userId) {
          throw new UnauthorizedError('Step-up token does not match authenticated user');
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };
}

