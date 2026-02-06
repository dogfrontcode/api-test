import { Request } from 'express';

/**
 * Interface para requisições autenticadas
 * Estende Express Request para incluir informações do usuário
 */
export interface IAuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

