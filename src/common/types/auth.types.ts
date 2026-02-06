/**
 * Tipos e DTOs relacionados a autenticação
 */

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
}

export interface StepUpTokenPayload {
  userId: number;
  purpose: 'step-up';
}

