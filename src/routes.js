import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentsConroller from './app/controllers/StudentsController';
import PlanosController from './app/controllers/PlanoController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/students', StudentsConroller.store);
routes.put('/students/:id', StudentsConroller.update);

routes.post('/planos', PlanosController.store);
routes.get('/planos', PlanosController.index);
routes.put('/planos/:id', PlanosController.update);
routes.delete('/planos/:id', PlanosController.delete);

export default routes;
