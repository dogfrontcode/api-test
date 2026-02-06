import { PrismaClient } from '@prisma/client';
import { IRepository } from '../interfaces/IRepository';

/**
 * Classe abstrata base para repositórios
 * Implementa padrão Repository para acesso a dados
 */
export abstract class BaseRepository<T> implements IRepository<T> {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  abstract findById(id: number): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract create(data: any): Promise<T>;
  abstract update(id: number, data: any): Promise<T>;
  abstract delete(id: number): Promise<void>;
}

