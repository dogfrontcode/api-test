import { RequestLog } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

/**
 * Repositório de logs de requisições
 * Registra todas as requisições HTTP para análise de segurança
 */
export class RequestLogRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: {
    method: string;
    path: string;
    ip: string;
    userId?: number;
    statusCode: number;
    reason?: string;
  }): Promise<RequestLog> {
    return this.prisma.requestLog.create({ data });
  }

  async findRecent(limit = 100): Promise<RequestLog[]> {
    return this.prisma.requestLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }

  async findByUserId(userId: number, limit = 50): Promise<RequestLog[]> {
    return this.prisma.requestLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }

  /**
   * Encontra tentativas negadas (401/403)
   */
  async findDeniedAttempts(limit = 50): Promise<RequestLog[]> {
    return this.prisma.requestLog.findMany({
      where: {
        statusCode: {
          in: [401, 403]
        }
      },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }
}

