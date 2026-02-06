/**
 * Classe base para erros customizados da aplicação
 * Segue padrão de Error Handling com erros operacionais vs programáticos
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Mantém prototype chain correto
    Object.setPrototypeOf(this, AppError.prototype);
    
    // Captura stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

