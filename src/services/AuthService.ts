import jwt from 'jsonwebtoken';
import { UserRepository } from '../common/repositories/UserRepository';
import { SessionRepository } from '../common/repositories/SessionRepository';
import { PasswordHasher } from '../common/utils/PasswordHasher';
import { UnauthorizedError } from '../common/errors';
import { appConfig } from '../common/config/app.config';
import { JWTPayload, StepUpTokenPayload } from '../common/types';

/**
 * Serviço de autenticação
 * Gerencia login, tokens JWT e refresh tokens
 */
export class AuthService {
  private userRepo: UserRepository;
  private sessionRepo: SessionRepository;

  constructor(userRepo: UserRepository, sessionRepo: SessionRepository) {
    this.userRepo = userRepo;
    this.sessionRepo = sessionRepo;
  }

  /**
   * Autentica usuário com email e senha
   */
  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await PasswordHasher.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    };
  }

  /**
   * Gera access token JWT (curta duração)
   */
  generateAccessToken(userId: number, email: string, role: string): string {
    const payload: JWTPayload = { userId, email, role };
    
    return jwt.sign(
      payload,
      appConfig.jwt.secret,
      { expiresIn: appConfig.jwt.accessTokenExpiry }
    );
  }

  /**
   * Gera refresh token e salva no banco
   */
  async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = this.generateRandomToken();
    const expiresAt = new Date(Date.now() + appConfig.jwt.refreshTokenExpiry);

    await this.sessionRepo.create({
      user: { connect: { id: userId } },
      refreshToken,
      expiresAt
    });

    return refreshToken;
  }

  /**
   * Valida access token JWT
   */
  verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, appConfig.jwt.secret) as JWTPayload;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }

  /**
   * Renova access token usando refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<string> {
    const session = await this.sessionRepo.findByRefreshToken(refreshToken);
    
    if (!session) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    if (session.expiresAt < new Date()) {
      await this.sessionRepo.deleteByRefreshToken(refreshToken);
      throw new UnauthorizedError('Refresh token expired');
    }

    const user = session.user;
    return this.generateAccessToken(user.id, user.email, user.role);
  }

  /**
   * Gera step-up token para operações sensíveis
   */
  generateStepUpToken(userId: number): string {
    const payload: StepUpTokenPayload = { 
      userId, 
      purpose: 'step-up' 
    };

    return jwt.sign(
      payload,
      appConfig.jwt.stepUpSecret,
      { expiresIn: appConfig.jwt.stepUpTokenExpiry }
    );
  }

  /**
   * Verifica step-up token
   */
  verifyStepUpToken(token: string): StepUpTokenPayload {
    try {
      const decoded = jwt.verify(token, appConfig.jwt.stepUpSecret) as StepUpTokenPayload;
      
      if (decoded.purpose !== 'step-up') {
        throw new Error('Invalid token purpose');
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired step-up token');
    }
  }

  /**
   * Logout: invalida refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    try {
      await this.sessionRepo.deleteByRefreshToken(refreshToken);
    } catch (error) {
      // Ignora erro se token já não existe
    }
  }

  /**
   * Logout de todas as sessões do usuário
   */
  async logoutAll(userId: number): Promise<void> {
    await this.sessionRepo.deleteByUserId(userId);
  }

  /**
   * Gera token aleatório seguro
   */
  private generateRandomToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }
}

