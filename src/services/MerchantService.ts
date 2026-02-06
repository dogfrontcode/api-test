import { MerchantRepository } from '../common/repositories/MerchantRepository';
import { AuditLogRepository } from '../common/repositories/AuditLogRepository';
import { ValidationError, NotFoundError } from '../common/errors';
import { appConfig } from '../common/config/app.config';

/**
 * Serviço de merchant
 * Gerencia configurações de callback URL e webhooks
 */
export class MerchantService {
  private merchantRepo: MerchantRepository;
  private auditRepo: AuditLogRepository;

  constructor(merchantRepo: MerchantRepository, auditRepo: AuditLogRepository) {
    this.merchantRepo = merchantRepo;
    this.auditRepo = auditRepo;
  }

  /**
   * Atualiza callback URL (versão SEGURA com validações)
   */
  async updateCallbackUrlSecure(
    userId: number,
    callbackUrl: string,
    ip: string
  ) {
    // Validar URL
    this.validateCallbackUrl(callbackUrl);

    // Buscar configuração atual
    const current = await this.merchantRepo.findByUserId(userId);
    const oldUrl = current?.callbackUrl || null;

    // Atualizar
    const updated = await this.merchantRepo.updateCallbackUrl(userId, callbackUrl);

    // Registrar audit log
    await this.auditRepo.logCallbackChange(userId, oldUrl, callbackUrl, ip);

    return updated;
  }

  /**
   * Atualiza callback URL (versão INSEGURA sem validações)
   */
  async updateCallbackUrlInsecure(
    userId: number,
    callbackUrl: string
  ) {
    // SEM VALIDAÇÃO - vulnerabilidade proposital
    const updated = await this.merchantRepo.updateCallbackUrl(userId, callbackUrl);
    return updated;
  }

  /**
   * Consulta callback URL
   */
  async getCallbackUrl(userId: number) {
    const config = await this.merchantRepo.findByUserId(userId);
    if (!config) {
      throw new NotFoundError('Merchant config not found');
    }
    return config;
  }

  /**
   * Valida callback URL (HTTPS obrigatório + allowlist)
   */
  private validateCallbackUrl(url: string): void {
    // Verificar se é URL válida
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      throw new ValidationError('Invalid URL format');
    }

    // HTTPS obrigatório
    if (parsedUrl.protocol !== 'https:') {
      throw new ValidationError('Callback URL must use HTTPS');
    }

    // Verificar se host está na allowlist
    const allowedHosts = appConfig.merchant.allowedHosts;
    if (!allowedHosts.includes(parsedUrl.hostname)) {
      throw new ValidationError(
        `Host not allowed. Allowed hosts: ${allowedHosts.join(', ')}`
      );
    }

    // Não permitir IPs locais (básico)
    if (parsedUrl.hostname === 'localhost' || 
        parsedUrl.hostname.startsWith('127.') ||
        parsedUrl.hostname.startsWith('192.168.') ||
        parsedUrl.hostname.startsWith('10.')) {
      throw new ValidationError('Local IPs not allowed');
    }
  }
}

