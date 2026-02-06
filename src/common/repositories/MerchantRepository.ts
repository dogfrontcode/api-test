import { MerchantConfig, Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

/**
 * Repositório de configurações de merchant
 * Gerencia URLs de callback e configurações de merchant
 */
export class MerchantRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByUserId(userId: number): Promise<MerchantConfig | null> {
    return this.prisma.merchantConfig.findUnique({
      where: { userId }
    });
  }

  async create(data: Prisma.MerchantConfigCreateInput): Promise<MerchantConfig> {
    return this.prisma.merchantConfig.create({ data });
  }

  async updateCallbackUrl(userId: number, callbackUrl: string): Promise<MerchantConfig> {
    // Tenta atualizar, se não existir, cria
    const existing = await this.findByUserId(userId);
    
    if (existing) {
      return this.prisma.merchantConfig.update({
        where: { userId },
        data: { callbackUrl }
      });
    } else {
      return this.prisma.merchantConfig.create({
        data: {
          userId,
          callbackUrl
        }
      });
    }
  }

  async delete(userId: number): Promise<void> {
    await this.prisma.merchantConfig.delete({
      where: { userId }
    });
  }
}

