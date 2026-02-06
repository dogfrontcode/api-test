import { AuditLogRepository } from '../common/repositories/AuditLogRepository';

/**
 * Serviço de auditoria
 * Gerencia logs de auditoria e compliance
 */
export class AuditService {
  private auditRepo: AuditLogRepository;

  constructor(auditRepo: AuditLogRepository) {
    this.auditRepo = auditRepo;
  }

  /**
   * Lista logs de auditoria de um usuário
   */
  async getUserAuditLogs(userId: number, limit = 50) {
    return this.auditRepo.findByUserId(userId, limit);
  }

  /**
   * Lista todos os logs de auditoria (admin only)
   */
  async getAllAuditLogs(limit = 100) {
    return this.auditRepo.findAll(limit);
  }

  /**
   * Registra log customizado
   */
  async log(data: {
    userId?: number;
    action: string;
    resource: string;
    details?: any;
    ip: string;
  }) {
    return this.auditRepo.create({
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      details: data.details ? JSON.stringify(data.details) : undefined,
      ip: data.ip
    });
  }
}

