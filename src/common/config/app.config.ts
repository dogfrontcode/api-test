/**
 * Configurações da aplicação centralizadas
 */
export const appConfig = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-prod',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    stepUpSecret: process.env.JWT_STEP_UP_SECRET || 'dev-step-up-secret',
    accessTokenExpiry: '15m',
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
    stepUpTokenExpiry: '5m'
  },

  // Rate Limiting
  rateLimit: {
    windowMs: 60 * 1000, // 1 minuto
    maxRequestsNormal: 60,
    maxRequestsAuth: 5,
    maxRequestsSensitive: 10
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },

  // Merchant callback URL validation
  merchant: {
    allowedHosts: [
      'api.example.com',
      'webhook.trusted.com',
      'callback.secure-merchant.com'
    ]
  }
};

