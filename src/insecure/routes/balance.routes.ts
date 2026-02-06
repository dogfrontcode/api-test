import { Router } from 'express';
import { InsecureBalanceController } from '../controllers/BalanceController';
import { BalanceService } from '../../services/BalanceService';
import { UserRepository } from '../../common/repositories/UserRepository';
import { AuditLogRepository } from '../../common/repositories/AuditLogRepository';
import { getPrismaClient } from '../../common/config/database.config';

/**
 * Rotas de saldo INSECURAS
 */
export function createInsecureBalanceRoutes(): Router {
  const router = Router();
  const prisma = getPrismaClient();
  
  const userRepo = new UserRepository(prisma);
  const auditRepo = new AuditLogRepository(prisma);
  const balanceService = new BalanceService(userRepo, auditRepo);
  const controller = new InsecureBalanceController(balanceService);

  // POST /insecure/balance/credit - Creditar em qualquer userId
  router.post('/credit', controller.credit);

  // GET /insecure/balance/me?userId=X - BOLA via query param
  router.get('/me', controller.getBalance);

  return router;
}

