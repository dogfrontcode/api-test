import { Router } from 'express';
import { SecureAuthController } from '../controllers/AuthController';
import { SecureAuthMiddleware } from '../middleware/SecureAuthMiddleware';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { RateLimitMiddleware } from '../middleware/RateLimitMiddleware';
import { AuthService } from '../../services/AuthService';
import { UserRepository } from '../../common/repositories/UserRepository';
import { SessionRepository } from '../../common/repositories/SessionRepository';
import { getPrismaClient } from '../../common/config/database.config';
import { loginSchema, refreshTokenSchema, reauthSchema } from '../validators/schemas';

/**
 * Rotas de autenticação SEGURAS
 * Com validação, rate limiting e proteção
 */
export function createSecureAuthRoutes(): Router {
  const router = Router();
  const prisma = getPrismaClient();
  
  const userRepo = new UserRepository(prisma);
  const sessionRepo = new SessionRepository(prisma);
  const authService = new AuthService(userRepo, sessionRepo);
  const authMiddleware = new SecureAuthMiddleware(authService);
  const controller = new SecureAuthController(authService);

  // POST /secure/auth/login
  // Rate limited + input validation
  router.post(
    '/login',
    RateLimitMiddleware.auth(),
    ValidationMiddleware.validateBody(loginSchema),
    controller.login
  );

  // POST /secure/auth/refresh
  // Renovar access token com refresh token
  router.post(
    '/refresh',
    ValidationMiddleware.validateBody(refreshTokenSchema),
    controller.refresh
  );

  // POST /secure/auth/reauth
  // Step-up authentication para operações sensíveis
  // Requer autenticação prévia
  router.post(
    '/reauth',
    authMiddleware.authenticate(),
    RateLimitMiddleware.auth(),
    ValidationMiddleware.validateBody(reauthSchema),
    controller.reauth
  );

  // POST /secure/auth/logout
  // Invalidar refresh token
  router.post(
    '/logout',
    authMiddleware.authenticate(),
    controller.logout
  );

  return router;
}

