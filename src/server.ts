import { createApp } from './app';
import { appConfig } from './common/config/app.config';
import { Logger } from './common/utils/Logger';
import { disconnectPrisma } from './common/config/database.config';

/**
 * Entry point da aplicação
 */
const logger = Logger.getInstance();
const app = createApp();

// Iniciar servidor
const server = app.listen(appConfig.port, () => {
  logger.info(`🚀 Server running on port ${appConfig.port}`);
  logger.info(`📝 Environment: ${appConfig.env}`);
  logger.info(`🔓 Insecure API: http://localhost:${appConfig.port}/insecure`);
  logger.info(`🔒 Secure API: http://localhost:${appConfig.port}/secure`);
  logger.info(`⚠️  WARNING: This lab contains intentional vulnerabilities for educational purposes only!`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      await disconnectPrisma();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', error);
      process.exit(1);
    }
  });
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    try {
      await disconnectPrisma();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', error);
      process.exit(1);
    }
  });
});

