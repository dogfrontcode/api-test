import { Router } from 'express';
import { InsecureMerchantController } from '../controllers/MerchantController';
import { MerchantService } from '../../services/MerchantService';
import { MerchantRepository } from '../../common/repositories/MerchantRepository';
import { AuditLogRepository } from '../../common/repositories/AuditLogRepository';
import { getPrismaClient } from '../../common/config/database.config';

/**
 * Rotas de merchant INSECURAS
 */
export function createInsecureMerchantRoutes(): Router {
  const router = Router();
  const prisma = getPrismaClient();
  
  const merchantRepo = new MerchantRepository(prisma);
  const auditRepo = new AuditLogRepository(prisma);
  const merchantService = new MerchantService(merchantRepo, auditRepo);
  const controller = new InsecureMerchantController(merchantService);

  // PATCH /insecure/merchant/callbackurl - Atualizar SEM validação
  router.patch('/callbackurl', controller.updateCallbackUrl);

  // GET /insecure/merchant/callbackurl - Consultar SEM auth
  router.get('/callbackurl', controller.getCallbackUrl);

  return router;
}

