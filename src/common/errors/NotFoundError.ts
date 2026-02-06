import { AppError } from './AppError';

/**
 * Erro 404 - Recurso não encontrado
 * Usado quando recurso solicitado não existe no banco
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

