import bcrypt from 'bcrypt';

/**
 * Classe utilitária para hash e verificação de senhas
 * Encapsula lógica de bcrypt
 */
export class PasswordHasher {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Gera hash de senha usando bcrypt
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compara senha em texto plano com hash
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Valida força mínima da senha
   */
  static validateStrength(password: string): { valid: boolean; message?: string } {
    if (!password || password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters' };
    }
    
    // Adicionar mais regras conforme necessário
    return { valid: true };
  }
}

