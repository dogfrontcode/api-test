import { PrismaClient } from '@prisma/client';

/**
 * Singleton do Prisma Client
 * Garante única conexão com banco de dados
 */
let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error']
    });
  }
  return prisma;
}

/**
 * Desconecta do banco (útil para testes e shutdown)
 */
export async function disconnectPrisma(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}

