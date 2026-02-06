import { UserRepository } from '../common/repositories/UserRepository';
import { AuditLogRepository } from '../common/repositories/AuditLogRepository';
import { ForbiddenError, NotFoundError, ValidationError } from '../common/errors';

/**
 * Serviço de saldo
 * Gerencia operações de crédito e consulta de saldo
 */
export class BalanceService {
  private userRepo: UserRepository;
  private auditRepo: AuditLogRepository;

  constructor(userRepo: UserRepository, auditRepo: AuditLogRepository) {
    this.userRepo = userRepo;
    this.auditRepo = auditRepo;
  }

  /**
   * Credita saldo em conta de usuário (apenas admin)
   */
  async creditBalance(
    targetUserId: number, 
    amount: number, 
    requesterId: number,
    requesterRole: string,
    ip: string
  ) {
    // Apenas admin pode creditar
    if (requesterRole !== 'admin') {
      throw new ForbiddenError('Only admin can credit balance');
    }

    // Validar amount
    if (amount <= 0) {
      throw new ValidationError('Amount must be positive');
    }

    // Verificar se usuário existe
    const user = await this.userRepo.findById(targetUserId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Creditar saldo
    const updated = await this.userRepo.updateBalance(targetUserId, amount);

    // Registrar audit log
    await this.auditRepo.logBalanceCredit(requesterId, targetUserId, amount, ip);

    return {
      userId: updated.id,
      balance: updated.balance,
      credited: amount
    };
  }

  /**
   * Consulta saldo do próprio usuário
   */
  async getMyBalance(userId: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      userId: user.id,
      balance: user.balance
    };
  }

  /**
   * Consulta saldo de qualquer usuário (INSEGURO - apenas para /insecure)
   */
  async getBalanceInsecure(userId?: number) {
    if (!userId) {
      throw new ValidationError('userId is required');
    }

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      userId: user.id,
      balance: user.balance
    };
  }
}

