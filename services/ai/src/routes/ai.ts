import { Router } from 'express';
import { getCompletion, getEmbedding } from '../controllers/aiController';
import { authenticateJWT } from '../../../common/middleware/auth';
import { RequestHandler } from 'express';

const router = Router();
    

router.post('/completions', authenticateJWT, getCompletion as RequestHandler);
router.post('/embeddings', authenticateJWT, getEmbedding as RequestHandler);

export default router;
