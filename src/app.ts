import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import { createInsecureRouter } from './insecure/routes';
import { createSecureRouter } from './secure/routes';
import { Logger } from './common/utils/Logger';
import { AppError } from './common/errors';
import { appConfig } from './common/config/app.config';
import { getPrismaClient } from './common/config/database.config';
import { RequestLogRepository } from './common/repositories/RequestLogRepository';

/**
 * Cria e configura aplicação Express
 */
export function createApp(): Express {
  const app = express();
  const logger = Logger.getInstance();
  const prisma = getPrismaClient();
  const requestLogRepo = new RequestLogRepository(prisma);

  // ===== Middleware Básico =====
  
  // Parse JSON
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Parse cookies
  app.use(cookieParser());
  
  // CORS
  app.use(cors(appConfig.cors));
  
  // Helmet (apenas para rotas /secure)
  app.use('/secure', helmet());

  // ===== Logging Middleware =====
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    
    // Log após resposta
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      // Extrair userId se disponível
      const userId = (req as any).user?.userId;
      
      logger.http('Request', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userId
      });

      // Salvar log no banco (async, não bloqueia)
      if (req.path.startsWith('/insecure') || req.path.startsWith('/secure')) {
        requestLogRepo.create({
          method: req.method,
          path: req.path,
          ip: req.ip || 'unknown',
          userId,
          statusCode: res.statusCode,
          reason: res.statusCode >= 400 ? res.statusMessage : undefined
        }).catch(err => {
          logger.error('Failed to save request log', err);
        });
      }
    });
    
    next();
  });

  // ===== Rotas =====
  
  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      env: appConfig.env
    });
  });

  // Montar routers
  app.use('/insecure', createInsecureRouter());
  app.use('/secure', createSecureRouter());

  // Rota raiz
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'API Security Lab - Laboratório Educacional',
      warning: '⚠️  Este laboratório contém vulnerabilidades propositais. Use APENAS para fins educacionais.',
      endpoints: {
        insecure: '/insecure/* - API vulnerável',
        secure: '/secure/* - API protegida',
        health: '/health - Health check'
      },
      documentation: 'Veja README.md para mais informações'
    });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found',
      path: req.path
    });
  });

  // ===== Error Handler =====
  
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error occurred', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });

    // Se é AppError, usar statusCode específico
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(appConfig.env === 'development' && { stack: err.stack })
      });
    }

    // Erro genérico
    res.status(500).json({
      success: false,
      message: appConfig.env === 'production' 
        ? 'Internal server error' 
        : err.message,
      ...(appConfig.env === 'development' && { stack: err.stack })
    });
  });

  return app;
}

