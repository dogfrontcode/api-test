import { Response } from 'express';

/**
 * Classe utilitária para padronizar respostas HTTP
 * Aplica formato consistente em toda API
 */
export class ResponseHandler {
  /**
   * Resposta de sucesso padrão
   */
  static success(res: Response, data: any, statusCode = 200): Response {
    return res.status(statusCode).json({
      success: true,
      data
    });
  }

  /**
   * Resposta de sucesso com mensagem
   */
  static successWithMessage(res: Response, message: string, data?: any, statusCode = 200): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Resposta de erro padrão
   */
  static error(res: Response, message: string, statusCode = 500, errors?: any): Response {
    const response: any = {
      success: false,
      message
    };

    if (errors) {
      response.errors = errors;
    }

    // Não vazar stack trace em produção
    if (process.env.NODE_ENV === 'development' && errors?.stack) {
      response.stack = errors.stack;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Resposta de erro de validação (422)
   */
  static validationError(res: Response, errors: any): Response {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  /**
   * Resposta de não autorizado (401)
   */
  static unauthorized(res: Response, message = 'Unauthorized'): Response {
    return res.status(401).json({
      success: false,
      message
    });
  }

  /**
   * Resposta de proibido (403)
   */
  static forbidden(res: Response, message = 'Forbidden'): Response {
    return res.status(403).json({
      success: false,
      message
    });
  }

  /**
   * Resposta de não encontrado (404)
   */
  static notFound(res: Response, message = 'Resource not found'): Response {
    return res.status(404).json({
      success: false,
      message
    });
  }
}

