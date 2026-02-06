import { Router } from 'express';
import { InsecureUsersController } from '../controllers/UsersController';
import { UserService } from '../../services/UserService';
import { UserRepository } from '../../common/repositories/UserRepository';
import { getPrismaClient } from '../../common/config/database.config';

/**
 * Rotas de usuários INSECURAS
 * SEM middleware de autenticação/autorização
 */
export function createInsecureUsersRoutes(): Router {
  const router = Router();
  const prisma = getPrismaClient();
  
  const userRepo = new UserRepository(prisma);
  const userService = new UserService(userRepo);
  const controller = new InsecureUsersController(userService);

  // POST /insecure/users - Criar usuário SEM autenticação
  router.post('/', controller.create);

  // GET /insecure/users - Listar TODOS os usuários SEM autenticação
  router.get('/', controller.list);

  // GET /insecure/users/:id - Ver qualquer usuário (IDOR)
  router.get('/:id', controller.getById);

  // PATCH /insecure/users/:id - Atualizar qualquer usuário (IDOR + Mass Assignment)
  router.patch('/:id', controller.update);

  // DELETE /insecure/users/:id - Deletar qualquer usuário
  router.delete('/:id', controller.delete);

  return router;
}

