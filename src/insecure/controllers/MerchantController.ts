import { Request, Response, NextFunction } from 'express';
import { MerchantService } from '../../services/MerchantService';
import { Logger } from '../../common/utils/Logger';
import { IController } from '../../common/interfaces/IController';

/**
 * Controller de merchant INSEGURO
 * VULNERABILIDADES PROPOSITAIS:
 * - Sem autenticação
 * - Sem validação de URL
 * - Sem step-up authentication
 * - Sem audit log
 * - Permite SSRF
 */
export class InsecureMerchantController implements IController {
  private merchantService: MerchantService;
  private logger: Logger;

  constructor(merchantService: MerchantService) {
    this.merchantService = merchantService;
    this.logger = Logger.getInstance();
  }

  /**
   * Atualizar callback URL SEM validação
   * VULNERABILIDADES:
   * - Aceita qualquer URL (HTTP, localhost, IPs internos)
   * - Sem step-up authentication
   * - Sem verificar ownership
   */
  updateCallbackUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { callback_url } = req.body;
      
      // VULNERABILIDADE: Aceita userId do body ou usa 1 como padrão
      const userId = req.body.userId || 1;
      
      // VULNERABILIDADE: Sem validação de URL
      // VULNERABILIDADE: Sem step-up authentication
      // VULNERABILIDADE: Sem verificar ownership
      const config = await this.merchantService.updateCallbackUrlInsecure(
        userId,
        callback_url
      );

      this.logger.info('Insecure callback URL updated', { 
        userId, 
        callbackUrl: callback_url 
      });

      res.json({ 
        success: true, 
        message: 'Callback URL updated',
        config 
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Consultar callback URL SEM autenticação
   */
  getCallbackUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // VULNERABILIDADE: Aceita userId do query ou usa 1
      const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
      
      const config = await this.merchantService.getCallbackUrl(userId);

      res.json({ success: true, config });
    } catch (error) {
      next(error);
    }
  };
}

