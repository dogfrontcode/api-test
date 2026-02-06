import { Session, Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

/**
 * Repositório de sessões
 * Gerencia tokens de refresh e sessões de usuários
 */
export class SessionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Prisma.SessionCreateInput): Promise<Session> {
    return this.prisma.session.create({ data });
  }

  async findByRefreshToken(refreshToken: string): Promise<Session | null> {
    return this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true }
    });
  }

  async findByUserId(userId: number): Promise<Session[]> {
    return this.prisma.session.findMany({
      where: { userId }
    });
  }

  async deleteByRefreshToken(refreshToken: string): Promise<void> {
    await this.prisma.session.delete({
      where: { refreshToken }
    });
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId }
    });
  }

  /**
   * Remove sessões expiradas
   */
  async cleanExpiredSessions(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    return result.count;
  }
}

