import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../../common/interfaces/IAuthRequest';
import { ForbiddenError } from '../../common/errors';

/**
 * Middleware de RBAC (Role-Based Access Control)
 * Verifica permissões baseadas em roles
 */
export class RBACMiddleware {
  /**
   * Requer role específica(s)
   */
  static requireRole(...allowedRoles: string[]) {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new ForbiddenError('User not authenticated');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError(`Insufficient permissions. Required roles: ${allowedRoles.join(', ')}`);
      }

      next();
    };
  }

  /**
   * Requer que seja admin OU o próprio usuário (ownership)
   */
  static requireOwnerOrAdmin(userIdParam: string = 'id') {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new ForbiddenError('User not authenticated');
      }

      const targetUserId = parseInt(req.params[userIdParam]);
      
      if (isNaN(targetUserId)) {
        throw new ForbiddenError('Invalid user ID');
      }

      // Admin pode acessar qualquer recurso
      // Ou usuário pode acessar seu próprio recurso
      if (req.user.role === 'admin' || req.user.userId === targetUserId) {
        next();
      } else {
        throw new ForbiddenError('Cannot access other users resources');
      }
    };
  }

  /**
   * Middleware apenas para admin
   */
  static requireAdmin() {
    return this.requireRole('admin');
  }
}

