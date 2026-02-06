import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../../common/errors';

/**
 * Middleware de validação com Zod
 * Valida body, params ou query com schemas Zod
 */
export class ValidationMiddleware {
  /**
   * Valida body da requisição
   */
  static validateBody(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));
          next(new ValidationError(JSON.stringify(errors)));
        } else {
          next(error);
        }
      }
    };
  }

  /**
   * Valida params da requisição
   */
  static validateParams(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.params = schema.parse(req.params);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));
          next(new ValidationError(JSON.stringify(errors)));
        } else {
          next(error);
        }
      }
    };
  }

  /**
   * Valida query da requisição
   */
  static validateQuery(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        req.query = schema.parse(req.query);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const errors = error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }));
          next(new ValidationError(JSON.stringify(errors)));
        } else {
          next(error);
        }
      }
    };
  }
}

