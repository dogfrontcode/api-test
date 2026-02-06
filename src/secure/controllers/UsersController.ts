import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../../common/interfaces/IAuthRequest';
import { UserService } from '../../services/UserService';
import { Logger } from '../../common/utils/Logger';
import { IController } from '../../common/interfaces/IController';

/**
 * Controller de usuários SEGURO
 * Implementa RBAC, ownership e validação
 */
export class SecureUsersController implements IController {
  private userService: UserService;
  private logger: Logger;

  constructor(userService: UserService) {
    this.userService = userService;
    this.logger = Logger.getInstance();
  }

  /**
   * Criar usuário (apenas admin)
   * Input validado pelo middleware Zod
   * RBAC aplicado pelo middleware
   */
  create = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, role } = req.body;
      
      const user = await this.userService.createUser({ 
        email, 
        password, 
        role 
      });

      this.logger.info('Secure user created', { 
        userId: user.id, 
        createdBy: req.user?.userId 
      });

      res.status(201).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Listar todos os usuários (apenas admin)
   * RBAC aplicado pelo middleware
   */
  list = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();

      res.json({ success: true, users });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Buscar usuário por ID (admin ou owner)
   * Ownership verificado pelo middleware
   */
  getById = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      const user = await this.userService.getUserById(parseInt(id));

      res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Atualizar usuário (admin ou owner)
   * Input validado pelo middleware Zod
   * Ownership verificado pelo middleware
   */
  update = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const requester = req.user!;
      
      const user = await this.userService.updateUser(
        parseInt(id),
        updateData,
        requester.userId,
        requester.role
      );

      this.logger.info('Secure user updated', { 
        userId: user.id, 
        updatedBy: requester.userId 
      });

      res.json({ success: true, user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletar usuário (apenas admin)
   * RBAC aplicado pelo middleware
   */
  delete = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const requester = req.user!;
      
      await this.userService.deleteUser(parseInt(id), requester.role);

      this.logger.info('Secure user deleted', { 
        userId: parseInt(id), 
        deletedBy: requester.userId 
      });

      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}

