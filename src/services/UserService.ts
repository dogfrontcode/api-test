import { UserRepository } from '../common/repositories/UserRepository';
import { PasswordHasher } from '../common/utils/PasswordHasher';
import { ValidationError, ForbiddenError, NotFoundError } from '../common/errors';
import { UserCreateDTO, UserUpdateDTO } from '../common/types';

/**
 * Serviço de usuários
 * Gerencia lógica de negócio relacionada a usuários
 */
export class UserService {
  private userRepo: UserRepository;

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  /**
   * Cria novo usuário
   */
  async createUser(data: UserCreateDTO) {
    // Validar se email já existe
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new ValidationError('Email already exists');
    }

    // Validar força da senha
    const passwordValidation = PasswordHasher.validateStrength(data.password);
    if (!passwordValidation.valid) {
      throw new ValidationError(passwordValidation.message!);
    }

    // Hash da senha
    const hashedPassword = await PasswordHasher.hash(data.password);

    // Criar usuário
    const user = await this.userRepo.create({
      email: data.email,
      password: hashedPassword,
      role: data.role || 'user'
    });

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Lista todos os usuários
   */
  async getAllUsers() {
    return this.userRepo.findAll();
  }

  /**
   * Busca usuário por ID
   */
  async getUserById(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Remover senha da resposta
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Atualiza usuário (com validação de ownership e role)
   */
  async updateUser(
    id: number, 
    data: UserUpdateDTO, 
    requesterId: number, 
    requesterRole: string
  ) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Lógica de ownership: apenas admin ou o próprio usuário
    if (requesterRole !== 'admin' && requesterId !== id) {
      throw new ForbiddenError('Cannot update other users');
    }

    // Apenas admin pode alterar role
    if (data.role && requesterRole !== 'admin') {
      throw new ForbiddenError('Only admin can change roles');
    }

    // Se alterar senha, fazer hash
    if (data.password) {
      const passwordValidation = PasswordHasher.validateStrength(data.password);
      if (!passwordValidation.valid) {
        throw new ValidationError(passwordValidation.message!);
      }
      data.password = await PasswordHasher.hash(data.password);
    }

    // Atualizar
    const updated = await this.userRepo.update(id, data);
    const { password, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  /**
   * Deleta usuário (apenas admin)
   */
  async deleteUser(id: number, requesterRole: string) {
    if (requesterRole !== 'admin') {
      throw new ForbiddenError('Only admin can delete users');
    }

    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.userRepo.delete(id);
  }
}

