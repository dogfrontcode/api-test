import rateLimit from 'express-rate-limit';
import { appConfig } from '../../common/config/app.config';

/**
 * Middleware de rate limiting
 * Protege contra brute force e DoS
 */
export class RateLimitMiddleware {
  /**
   * Rate limit padrão para rotas normais
   * 60 requisições por minuto por IP
   */
  static normal() {
    return rateLimit({
      windowMs: appConfig.rateLimit.windowMs,
      max: appConfig.rateLimit.maxRequestsNormal,
      message: 'Too many requests, please try again later',
      standardHeaders: true,
      legacyHeaders: false
    });
  }

  /**
   * Rate limit estrito para autenticação
   * 5 requisições por minuto por IP (previne brute force)
   */
  static auth() {
    return rateLimit({
      windowMs: appConfig.rateLimit.windowMs,
      max: appConfig.rateLimit.maxRequestsAuth,
      message: 'Too many login attempts, please try again later',
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: true // Só conta tentativas falhas
    });
  }

  /**
   * Rate limit para operações sensíveis
   * 10 requisições por minuto por IP
   */
  static sensitive() {
    return rateLimit({
      windowMs: appConfig.rateLimit.windowMs,
      max: appConfig.rateLimit.maxRequestsSensitive,
      message: 'Too many requests to sensitive endpoint, please try again later',
      standardHeaders: true,
      legacyHeaders: false
    });
  }
}

