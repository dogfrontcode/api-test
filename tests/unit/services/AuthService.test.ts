import { AuthService } from '../../../src/services/AuthService';
import { UserRepository } from '../../../src/common/repositories/UserRepository';
import { SessionRepository } from '../../../src/common/repositories/SessionRepository';
import { UnauthorizedError } from '../../../src/common/errors';
import { PasswordHasher } from '../../../src/common/utils/PasswordHasher';

// Mock repositories
jest.mock('../../../src/common/repositories/UserRepository');
jest.mock('../../../src/common/repositories/SessionRepository');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockSessionRepo: jest.Mocked<SessionRepository>;

  beforeEach(() => {
    mockUserRepo = new UserRepository(null as any) as jest.Mocked<UserRepository>;
    mockSessionRepo = new SessionRepository(null as any) as jest.Mocked<SessionRepository>;
    authService = new AuthService(mockUserRepo, mockSessionRepo);
  });

  describe('login', () => {
    it('should return user data when credentials are valid', async () => {
      const hashedPassword = await PasswordHasher.hash('password123');
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        role: 'user'
      });
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw UnauthorizedError when user does not exist', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login('nonexistent@example.com', 'password123')
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError when password is incorrect', async () => {
      const hashedPassword = await PasswordHasher.hash('correct-password');
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(
        authService.login('test@example.com', 'wrong-password')
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('generateAccessToken', () => {
    it('should generate valid JWT token', () => {
      const token = authService.generateAccessToken(1, 'test@example.com', 'user');

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid token', () => {
      const token = authService.generateAccessToken(1, 'test@example.com', 'user');
      const decoded = authService.verifyAccessToken(token);

      expect(decoded.userId).toBe(1);
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('user');
    });

    it('should throw UnauthorizedError for invalid token', () => {
      expect(() => {
        authService.verifyAccessToken('invalid-token');
      }).toThrow(UnauthorizedError);
    });
  });
});

