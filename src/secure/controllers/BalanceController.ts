import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../../common/interfaces/IAuthRequest';
import { BalanceService } from '../../services/BalanceService';
import { Logger } from '../../common/utils/Logger';
import { IController } from '../../common/interfaces/IController';

/**
 * Controller de saldo SEGURO
 * Implementa RBAC e audit logging
 */
export class SecureBalanceController implements IController {
  private balanceService: BalanceService;
  private logger: Logger;

  constructor(balanceService: BalanceService) {
    this.balanceService = balanceService;
    this.logger = Logger.getInstance();
  }

  /**
   * Creditar saldo (apenas admin)
   * Input validado pelo middleware Zod
   * RBAC aplicado pelo middleware
   * Registra audit log
   */
  credit = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId, amount } = req.body;
      const requester = req.user!;
      
      const result = await this.balanceService.creditBalance(
        userId,
        amount,
        requester.userId,
        requester.role,
        req.ip || 'unknown'
      );

      this.logger.info('Secure balance credited', { 
        targetUserId: userId, 
        amount, 
        creditedBy: requester.userId 
      });

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Consultar próprio saldo
   * Apenas retorna saldo do usuário autenticado
   */
  getMyBalance = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      
      const balance = await this.balanceService.getMyBalance(userId);

      res.json({ success: true, ...balance });
    } catch (error) {
      next(error);
    }
  };
}

