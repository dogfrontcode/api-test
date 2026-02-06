import { Router } from 'express';
import { SecureUsersController } from '../controllers/UsersController';
import { SecureAuthMiddleware } from '../middleware/SecureAuthMiddleware';
import { RBACMiddleware } from '../middleware/RBACMiddleware';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { RateLimitMiddleware } from '../middleware/RateLimitMiddleware';
import { AuthService } from '../../services/AuthService';
import { UserService } from '../../services/UserService';
import { UserRepository } from '../../common/repositories/UserRepository';
import { SessionRepository } from '../../common/repositories/SessionRepository';
import { getPrismaClient } from '../../common/config/database.config';
import { createUserSchema, updateUserSchema, userIdParamSchema } from '../validators/schemas';

/**
 * Rotas de usuários SEGURAS
 * Com autenticação, RBAC, ownership e validação
 */
export function createSecureUsersRoutes(): Router {
  const router = Router();
  const prisma = getPrismaClient();
  
  const userRepo = new UserRepository(prisma);
  const sessionRepo = new SessionRepository(prisma);
  const authService = new AuthService(userRepo, sessionRepo);
  const userService = new UserService(userRepo);
  const authMiddleware = new SecureAuthMiddleware(authService);
  const controller = new SecureUsersController(userService);

  // POST /secure/users
  // Criar usuário (apenas admin)
  router.post(
    '/',
    authMiddleware.authenticate(),
    RBACMiddleware.requireAdmin(),
    ValidationMiddleware.validateBody(createUserSchema),
    RateLimitMiddleware.normal(),
    controller.create
  );

  // GET /secure/users
  // Listar todos os usuários (apenas admin)
  router.get(
    '/',
    authMiddleware.authenticate(),
    RBACMiddleware.requireAdmin(),
    RateLimitMiddleware.normal(),
    controller.list
  );

  // GET /secure/users/:id
  // Buscar usuário por ID (admin ou owner)
  router.get(
    '/:id',
    authMiddleware.authenticate(),
    ValidationMiddleware.validateParams(userIdParamSchema),
    RBACMiddleware.requireOwnerOrAdmin('id'),
    RateLimitMiddleware.normal(),
    controller.getById
  );

  // PATCH /secure/users/:id
  // Atualizar usuário (admin ou owner)
  router.patch(
    '/:id',
    authMiddleware.authenticate(),
    ValidationMiddleware.validateParams(userIdParamSchema),
    ValidationMiddleware.validateBody(updateUserSchema),
    RBACMiddleware.requireOwnerOrAdmin('id'),
    RateLimitMiddleware.normal(),
    controller.update
  );

  // DELETE /secure/users/:id
  // Deletar usuário (apenas admin)
  router.delete(
    '/:id',
    authMiddleware.authenticate(),
    ValidationMiddleware.validateParams(userIdParamSchema),
    RBACMiddleware.requireAdmin(),
    RateLimitMiddleware.normal(),
    controller.delete
  );

  return router;
}

