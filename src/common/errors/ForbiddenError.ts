import { AppError } from './AppError';

/**
 * Erro 403 - Proibido
 * Usado quando usuário está autenticado mas não tem permissão
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

