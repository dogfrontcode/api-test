/**
 * Interface base para repositórios
 * Define contrato CRUD básico para acesso a dados
 */
export interface IRepository<T> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: number, data: any): Promise<T>;
  delete(id: number): Promise<void>;
}

