import { AppError } from './AppError';

/**
 * Erro 422 - Validação falhou
 * Usado quando input do usuário não passa nas validações
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 422);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

