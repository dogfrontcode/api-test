import { Router } from 'express';
import { InsecureAuthController } from '../controllers/AuthController';
import { AuthService } from '../../services/AuthService';
import { UserRepository } from '../../common/repositories/UserRepository';
import { SessionRepository } from '../../common/repositories/SessionRepository';
import { getPrismaClient } from '../../common/config/database.config';

/**
 * Rotas de autenticação INSECURAS
 */
export function createInsecureAuthRoutes(): Router {
  const router = Router();
  const prisma = getPrismaClient();
  
  const userRepo = new UserRepository(prisma);
  const sessionRepo = new SessionRepository(prisma);
  const authService = new AuthService(userRepo, sessionRepo);
  const controller = new InsecureAuthController(authService);

  // POST /insecure/auth/login - Login sem rate limit
  router.post('/login', controller.login);

  // POST /insecure/auth/logout - Logout simples
  router.post('/logout', controller.logout);

  return router;
}

