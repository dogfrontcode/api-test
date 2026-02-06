import { Router } from 'express';
import { createSecureAuthRoutes } from './auth.routes';
import { createSecureUsersRoutes } from './users.routes';
import { createSecureBalanceRoutes } from './balance.routes';
import { createSecureMerchantRoutes } from './merchant.routes';

/**
 * Router principal das rotas SEGURAS
 * Agrupa todas as rotas /secure/*
 */
export function createSecureRouter(): Router {
  const router = Router();

  // Montar sub-rotas
  router.use('/auth', createSecureAuthRoutes());
  router.use('/users', createSecureUsersRoutes());
  router.use('/balance', createSecureBalanceRoutes());
  router.use('/merchant', createSecureMerchantRoutes());

  return router;
}

