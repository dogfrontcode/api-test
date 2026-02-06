import { User, Prisma } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

/**
 * Repositório de usuários
 * Gerencia operações CRUD na tabela User
 */
export class UserRepository extends BaseRepository<User> {
  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        balance: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      select: { 
        id: true, 
        email: true, 
        role: true, 
        balance: true, 
        createdAt: true,
        updatedAt: true,
        password: false // Nunca retornar senha em listagens
      }
    }) as any;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ 
      where: { id }, 
      data,
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        balance: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  /**
   * Atualiza saldo do usuário (incrementa/decrementa)
   */
  async updateBalance(userId: number, amount: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } }
    });
  }

  /**
   * Define saldo específico (para operações inseguras)
   */
  async setBalance(userId: number, balance: number): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { balance }
    });
  }
}

