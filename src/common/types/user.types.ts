/**
 * Tipos e DTOs relacionados a usuários
 */

export interface UserDTO {
  id: number;
  email: string;
  role: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateDTO {
  email: string;
  password: string;
  role?: string;
}

export interface UserUpdateDTO {
  email?: string;
  password?: string;
  role?: string;
  balance?: number;
}

export type UserRole = 'admin' | 'user';

