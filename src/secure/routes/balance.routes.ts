import { Router } from 'express';
import { SecureBalanceController } from '../controllers/BalanceController';
import { SecureAuthMiddleware } from '../middleware/SecureAuthMiddleware';
import { RBACMiddleware } from '../middleware/RBACMiddleware';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { RateLimitMiddleware } from '../middleware/RateLimitMiddleware';
import { AuthService } from '../../services/AuthService';
import { BalanceService } from '../../services/BalanceService';
import { UserRepository } from '../../common/repositories/UserRepository';
import { SessionRepository } from '../../common/repositories/SessionRepository';
import { AuditLogRepository } from '../../common/repositories/AuditLogRepository';
import { getPrismaClient } from '../../common/config/database.config';
import { creditBalanceSchema } from '../validators/schemas';

/**
 * Rotas de saldo SEGURAS
 * Com autenticação, RBAC e audit logging
 */
export function createSecureBalanceRoutes(): Router {
  const router = Router();
  const prisma = getPrismaClient();
  
  const userRepo = new UserRepository(prisma);
  const sessionRepo = new SessionRepository(prisma);
  const auditRepo = new AuditLogRepository(prisma);
  const authService = new AuthService(userRepo, sessionRepo);
  const balanceService = new BalanceService(userRepo, auditRepo);
  const authMiddleware = new SecureAuthMiddleware(authService);
  const controller = new SecureBalanceController(balanceService);

  // POST /secure/balance/credit
  // Creditar saldo (apenas admin)
  router.post(
    '/credit',
    authMiddleware.authenticate(),
    RBACMiddleware.requireAdmin(),
    ValidationMiddleware.validateBody(creditBalanceSchema),
    RateLimitMiddleware.sensitive(),
    controller.credit
  );

  // GET /secure/balance/me
  // Consultar próprio saldo
  router.get(
    '/me',
    authMiddleware.authenticate(),
    RateLimitMiddleware.normal(),
    controller.getMyBalance
  );

  return router;
}

