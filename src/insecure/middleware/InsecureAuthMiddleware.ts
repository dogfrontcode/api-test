import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de autenticação INSEGURO
 * VULNERABILIDADES PROPOSITAIS:
 * - Apenas verifica existência de cookie
 * - Não valida token
 * - Sempre passa (não bloqueia)
 */
export class InsecureAuthMiddleware {
  /**
   * Middleware de autenticação fraco
   * VULNERABILIDADE: Apenas verifica se existe cookie, não valida
   */
  static authenticate() {
    return (req: any, res: Response, next: NextFunction) => {
      // VULNERABILIDADE: Apenas verifica se existe cookie
      const sessionId = req.cookies?.session_id;
      
      if (sessionId) {
        // VULNERABILIDADE: Define user sem validar
        req.user = { 
          sessionId,
          // VULNERABILIDADE: Dados fake/mínimos
          userId: 1,
          role: 'admin'
        };
      }
      
      // VULNERABILIDADE: Sempre passa, mesmo sem autenticação
      next();
    };
  }

  /**
   * Middleware fake que não faz nada
   */
  static optionalAuth() {
    return (req: Request, res: Response, next: NextFunction) => {
      next();
    };
  }
}

