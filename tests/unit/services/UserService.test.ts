import { UserService } from '../../../src/services/UserService';
import { UserRepository } from '../../../src/common/repositories/UserRepository';
import { ValidationError, ForbiddenError, NotFoundError } from '../../../src/common/errors';

// Mock repository
jest.mock('../../../src/common/repositories/UserRepository');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepo = new UserRepository(null as any) as jest.Mocked<UserRepository>;
    userService = new UserService(mockUserRepo);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue({
        id: 1,
        email: 'new@example.com',
        password: 'hashed-password',
        role: 'user',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const result = await userService.createUser({
        email: 'new@example.com',
        password: 'password123'
      });

      expect(result.email).toBe('new@example.com');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ValidationError if email already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({
        id: 1,
        email: 'existing@example.com',
        password: 'hash',
        role: 'user',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await expect(
        userService.createUser({
          email: 'existing@example.com',
          password: 'password123'
        })
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for weak password', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(
        userService.createUser({
          email: 'new@example.com',
          password: '123' // Too short
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('updateUser', () => {
    it('should allow user to update their own data', async () => {
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        password: 'hash',
        role: 'user',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockUserRepo.update.mockResolvedValue({
        ...mockUser,
        email: 'updated@example.com'
      });

      const result = await userService.updateUser(
        1,
        { email: 'updated@example.com' },
        1, // Same user
        'user'
      );

      expect(result.email).toBe('updated@example.com');
    });

    it('should throw ForbiddenError when user tries to update another user', async () => {
      const mockUser = {
        id: 2,
        email: 'other@example.com',
        password: 'hash',
        role: 'user',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);

      await expect(
        userService.updateUser(
          2,
          { email: 'hacked@example.com' },
          1, // Different user
          'user'
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it('should throw ForbiddenError when non-admin tries to change role', async () => {
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        password: 'hash',
        role: 'user',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);

      await expect(
        userService.updateUser(
          1,
          { role: 'admin' },
          1,
          'user' // Not admin
        )
      ).rejects.toThrow(ForbiddenError);
    });

    it('should allow admin to update any user', async () => {
      const mockUser = {
        id: 2,
        email: 'user@example.com',
        password: 'hash',
        role: 'user',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockUserRepo.update.mockResolvedValue({
        ...mockUser,
        role: 'admin'
      });

      const result = await userService.updateUser(
        2,
        { role: 'admin' },
        1, // Different user
        'admin' // But requester is admin
      );

      expect(result.role).toBe('admin');
    });
  });

  describe('deleteUser', () => {
    it('should throw ForbiddenError when non-admin tries to delete', async () => {
      await expect(
        userService.deleteUser(1, 'user')
      ).rejects.toThrow(ForbiddenError);
    });

    it('should allow admin to delete user', async () => {
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        password: 'hash',
        role: 'user',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepo.findById.mockResolvedValue(mockUser);
      mockUserRepo.delete.mockResolvedValue(undefined);

      await userService.deleteUser(1, 'admin');

      expect(mockUserRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockUserRepo.findById.mockResolvedValue(null);

      await expect(
        userService.deleteUser(999, 'admin')
      ).rejects.toThrow(NotFoundError);
    });
  });
});

