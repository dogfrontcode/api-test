/**
 * Setup global para testes Jest
 */

// Definir variáveis de ambiente para testes
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_STEP_UP_SECRET = 'test-step-up-secret';
process.env.LOG_LEVEL = 'error'; // Silenciar logs em testes

// Timeout padrão para testes
jest.setTimeout(10000);

