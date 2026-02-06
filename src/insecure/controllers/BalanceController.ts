import { Request, Response, NextFunction } from 'express';
import { BalanceService } from '../../services/BalanceService';
import { Logger } from '../../common/utils/Logger';
import { IController } from '../../common/interfaces/IController';

/**
 * Controller de saldo INSEGURO
 * VULNERABILIDADES PROPOSITAIS:
 * - Sem autenticação/autorização
 * - Permite creditar em qualquer usuário
 * - Query param permite vazamento de dados (BOLA)
 */
export class InsecureBalanceController implements IController {
  private balanceService: BalanceService;
  private logger: Logger;

  constructor(balanceService: BalanceService) {
    this.balanceService = balanceService;
    this.logger = Logger.getInstance();
  }

  /**
   * Creditar saldo SEM verificar permissão
   * VULNERABILIDADE: Qualquer um pode creditar em qualquer usuário
   */
  credit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, amount } = req.body;
      
      // VULNERABILIDADE: Aceita userId arbitrário do body
      // VULNERABILIDADE: Sem verificar se requisitante é admin
      const result = await this.balanceService.creditBalance(
        userId,
        amount,
        1, // VULNERABILIDADE: Requester ID fake
        'admin', // VULNERABILIDADE: Role fake
        req.ip || 'unknown'
      );

      this.logger.info('Insecure balance credited', { userId, amount });

      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Consultar saldo com userId via query param
   * VULNERABILIDADE: BOLA - Broken Object Level Authorization
   * Query param permite ver saldo de qualquer usuário
   */
  getBalance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // VULNERABILIDADE: Aceita userId via query param
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'userId query parameter is required' 
        });
      }

      // VULNERABILIDADE: Sem verificar se requisitante pode ver este saldo
      const balance = await this.balanceService.getBalanceInsecure(userId);

      res.json({ success: true, ...balance });
    } catch (error) {
      next(error);
    }
  };
}

