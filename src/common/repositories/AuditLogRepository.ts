import { AuditLog, Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

/**
 * Repositório de logs de auditoria
 * Registra ações importantes para compliance e segurança
 */
export class AuditLogRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: {
    userId?: number;
    action: string;
    resource: string;
    details?: string;
    ip: string;
  }): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        details: data.details,
        ip: data.ip
      }
    });
  }

  async findByUserId(userId: number, limit = 50): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit
    });
  }

  async findAll(limit = 100): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        }
      }
    });
  }

  /**
   * Registra alteração de callback URL
   */
  async logCallbackChange(userId: number, oldUrl: string | null, newUrl: string, ip: string): Promise<AuditLog> {
    return this.create({
      userId,
      action: 'CALLBACK_CHANGE',
      resource: 'merchant',
      details: JSON.stringify({ oldUrl, newUrl }),
      ip
    });
  }

  /**
   * Registra crédito de saldo
   */
  async logBalanceCredit(userId: number, targetUserId: number, amount: number, ip: string): Promise<AuditLog> {
    return this.create({
      userId,
      action: 'CREDIT',
      resource: 'balance',
      details: JSON.stringify({ targetUserId, amount }),
      ip
    });
  }
}

