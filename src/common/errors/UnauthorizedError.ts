import { AppError } from './AppError';

/**
 * Erro 401 - Não autenticado
 * Usado quando token JWT está ausente, inválido ou expirado
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

