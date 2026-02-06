import { Request, Response, NextFunction } from 'express';
import { UserService } from '../../services/UserService';
import { Logger } from '../../common/utils/Logger';
import { IController } from '../../common/interfaces/IController';

/**
 * Controller de usuários INSEGURO
 * VULNERABILIDADES PROPOSITAIS:
 * - Sem autenticação/autorização
 * - Sem validação de input
 * - Mass assignment permitido
 * - IDOR (Insecure Direct Object Reference)
 */
export class InsecureUsersController implements IController {
  private userService: UserService;
  private logger: Logger;

  constructor(userService: UserService) {
    this.userService = userService;
    this.logger = Logger.getInstance();
  }

  /**
   * Criar usuário SEM autenticação
   * VULNERABILIDADE: Qualquer um pode criar usuários
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, role } = req.body;
      
      // VULNERABILIDADE: Sem validação, permite definir role arbitrário
      const user = await this.userService.createUser({ 
        email, 
        password, 
        role: role || 'user' // VULNERABILIDADE: Aceita role do input
      });

      this.logger.info('Insecure user created', { userId: user.id });

      res.status(201).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Listar todos os usuários SEM autenticação
   * VULNERABILIDADE: Dados sensíveis expostos publicamente
   */
  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      
      // VULNERABILIDADE: Retorna TODOS os usuários sem verificar permissão
      res.json({ success: true, users });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Buscar usuário por ID SEM verificar ownership
   * VULNERABILIDADE: IDOR - qualquer um pode ver qualquer usuário
   */
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // VULNERABILIDADE: Sem verificar se requisitante pode ver este usuário
      const user = await this.userService.getUserById(parseInt(id));

      res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Atualizar usuário SEM verificar ownership
   * VULNERABILIDADE: IDOR + Mass Assignment
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // VULNERABILIDADE: Aceita TODOS os campos do body (mass assignment)
      // VULNERABILIDADE: Permite alterar role sem ser admin
      // VULNERABILIDADE: Usa admin fake como requester
      const user = await this.userService.updateUser(
        parseInt(id),
        updateData,
        1, // VULNERABILIDADE: Requester ID fake
        'admin' // VULNERABILIDADE: Role fake
      );

      this.logger.info('Insecure user updated', { userId: user.id });

      res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletar usuário SEM verificar permissão
   * VULNERABILIDADE: Qualquer um pode deletar usuários
   */
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // VULNERABILIDADE: Sem verificar se é admin
      await this.userService.deleteUser(parseInt(id), 'admin');

      this.logger.info('Insecure user deleted', { userId: parseInt(id) });

      res.json({ success: true, message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  };
}

