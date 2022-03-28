import { Router } from 'express';
import { AuthenticateController } from '../controllers/auth';
import {
  CreateComplimentController,
  ListReceivedComplimentsController,
  ListSentComplimentsController
} from '../controllers/compliments';
import { CreateTagController, ListTagsController } from '../controllers/tags';
import { RefreshTokenController } from '../controllers/tokens';
import {
  CreateUserController,
  ListUsersController
} from '../controllers/users';
import { ensureAdmin, ensureAuthenticated } from '../middlewares';

const router = Router();

const authenticateController = new AuthenticateController();
const refreshTokenController = new RefreshTokenController();

const listUsersController = new ListUsersController();
const createUserController = new CreateUserController();

const listTagsController = new ListTagsController();
const createTagController = new CreateTagController();

const listSentComplimentsController = new ListSentComplimentsController();
const listReceivedComplimentsController =
  new ListReceivedComplimentsController();
const createComplimentController = new CreateComplimentController();

router.post('/session', authenticateController.handle);
router.post('/refresh-token', refreshTokenController.handle);

router.get('/users', ensureAuthenticated, listUsersController.handle);
router.post('/users', createUserController.handle);

router.get('/tags', ensureAuthenticated, listTagsController.handle);
router.post(
  '/tags',
  ensureAuthenticated,
  ensureAdmin,
  createTagController.handle
);

router.get(
  '/compliments/sent',
  ensureAuthenticated,
  listSentComplimentsController.handle
);
router.get(
  '/compliments/received',
  ensureAuthenticated,
  listReceivedComplimentsController.handle
);
router.post(
  '/compliments',
  ensureAuthenticated,
  createComplimentController.handle
);

export { router };
