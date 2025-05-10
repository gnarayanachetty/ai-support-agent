import { Router } from 'express';
import {
  createChatSession,
  getChatSession,
  addMessageToSession,
  getUserChats
} from '../controllers/chatController';
import { authenticateJWT } from '../../../common/middleware/auth';

const router = Router();

import { RequestHandler } from 'express';

router.post('/', authenticateJWT, createChatSession as RequestHandler);
router.get('/:id', authenticateJWT, getChatSession as RequestHandler);
router.post('/:id/messages', authenticateJWT, addMessageToSession as RequestHandler);
router.get('/user/:userId', authenticateJWT, getUserChats as RequestHandler);

export default router;
