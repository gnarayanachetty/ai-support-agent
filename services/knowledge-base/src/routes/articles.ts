import { Router } from 'express';
import {
  createArticle,
  getArticle,
  listArticles,
  updateArticle,
  deleteArticle,
  searchArticles
} from '../controllers/articlesController';

const router = Router();

router.post('/', createArticle);
router.get('/:id', getArticle);
router.get('/', listArticles);
router.patch('/:id', updateArticle);
router.delete('/:id', deleteArticle);
router.post('/search', searchArticles);

export default router;
