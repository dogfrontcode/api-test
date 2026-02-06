import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../../common/interfaces/IAuthRequest';
import { MerchantService } from '../../services/MerchantService';
import { Logger } from '../../common/utils/Logger';
import { IController } from '../../common/interfaces/IController';

/**
 * Controller de merchant SEGURO
 * Implementa validação de URL, step-up auth e audit log
 */
export class SecureMerchantController implements IController {
  private merchantService: MerchantService;
  private logger: Logger;

  constructor(merchantService: MerchantService) {
    this.merchantService = merchantService;
    this.logger = Logger.getInstance();
  }

  /**
   * Atualizar callback URL com segurança
   * - Requer autenticação
   * - Requer step-up token
   * - Valida URL (HTTPS + allowlist)
   * - Registra audit log
   */
  updateCallbackUrl = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { callback_url } = req.body;
      const userId = req.user!.userId;
      
      // Step-up token já foi validado pelo middleware
      
      const config = await this.merchantService.updateCallbackUrlSecure(
        userId,
        callback_url,
        req.ip || 'unknown'
      );

      this.logger.info('Secure callback URL updated', { 
        userId, 
        callbackUrl: callback_url 
      });

      res.json({ 
        success: true, 
        message: 'Callback URL updated successfully',
        config 
      });
    } catch (error) {
      this.logger.warn('Failed to update callback URL', {
        userId: req.user?.userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      next(error);
    }
  };

  /**
   * Consultar callback URL (apenas próprio)
   */
  getCallbackUrl = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      
      const config = await this.merchantService.getCallbackUrl(userId);

      res.json({ success: true, config });
    } catch (error) {
      next(error);
    }
  };
}

