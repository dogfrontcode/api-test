import { Router } from 'express';
import { createInsecureAuthRoutes } from './auth.routes';
import { createInsecureUsersRoutes } from './users.routes';
import { createInsecureBalanceRoutes } from './balance.routes';
import { createInsecureMerchantRoutes } from './merchant.routes';

/**
 * Router principal das rotas INSECURAS
 * Agrupa todas as rotas /insecure/*
 */
export function createInsecureRouter(): Router {
  const router = Router();

  // Montar sub-rotas
  router.use('/auth', createInsecureAuthRoutes());
  router.use('/users', createInsecureUsersRoutes());
  router.use('/balance', createInsecureBalanceRoutes());
  router.use('/merchant', createInsecureMerchantRoutes());

  return router;
}

