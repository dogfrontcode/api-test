import { Router } from 'express';
import { SecureMerchantController } from '../controllers/MerchantController';
import { SecureAuthMiddleware } from '../middleware/SecureAuthMiddleware';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { RateLimitMiddleware } from '../middleware/RateLimitMiddleware';
import { AuthService } from '../../services/AuthService';
import { MerchantService } from '../../services/MerchantService';
import { UserRepository } from '../../common/repositories/UserRepository';
import { SessionRepository } from '../../common/repositories/SessionRepository';
import { MerchantRepository } from '../../common/repositories/MerchantRepository';
import { AuditLogRepository } from '../../common/repositories/AuditLogRepository';
import { getPrismaClient } from '../../common/config/database.config';
import { updateCallbackUrlSchema } from '../validators/schemas';

/**
 * Rotas de merchant SEGURAS
 * Com autenticação, step-up, validação de URL e audit log
 */
export function createSecureMerchantRoutes(): Router {
  const router = Router();
  const prisma = getPrismaClient();
  
  const userRepo = new UserRepository(prisma);
  const sessionRepo = new SessionRepository(prisma);
  const merchantRepo = new MerchantRepository(prisma);
  const auditRepo = new AuditLogRepository(prisma);
  const authService = new AuthService(userRepo, sessionRepo);
  const merchantService = new MerchantService(merchantRepo, auditRepo);
  const authMiddleware = new SecureAuthMiddleware(authService);
  const controller = new SecureMerchantController(merchantService);

  // PATCH /secure/merchant/callbackurl
  // Atualizar callback URL com step-up authentication
  // - Requer autenticação
  // - Requer step-up token (header X-Step-Up-Token)
  // - Valida URL (HTTPS + allowlist)
  // - Rate limited
  router.patch(
    '/callbackurl',
    authMiddleware.authenticate(),
    authMiddleware.requireStepUp(),
    ValidationMiddleware.validateBody(updateCallbackUrlSchema),
    RateLimitMiddleware.sensitive(),
    controller.updateCallbackUrl
  );

  // GET /secure/merchant/callbackurl
  // Consultar callback URL (apenas próprio)
  router.get(
    '/callbackurl',
    authMiddleware.authenticate(),
    RateLimitMiddleware.normal(),
    controller.getCallbackUrl
  );

  return router;
}

