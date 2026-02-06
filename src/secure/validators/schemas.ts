import { z } from 'zod';

/**
 * Schemas de validação com Zod
 * Define contratos de input para rotas seguras
 */

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

export const reauthSchema = z.object({
  password: z.string().min(1, 'Password is required')
});

// User schemas
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'user']).optional()
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['admin', 'user']).optional(),
  balance: z.number().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided'
});

export const userIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a number')
});

// Balance schemas
export const creditBalanceSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  amount: z.number().positive('Amount must be positive')
});

// Merchant schemas
export const updateCallbackUrlSchema = z.object({
  callback_url: z.string().url('Invalid URL format')
});

