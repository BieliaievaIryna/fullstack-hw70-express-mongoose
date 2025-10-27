import { Router } from 'express';
import {
  getArticlesHandler,
  postArticlesHandler,
  getArticleByIdHandler,
  putArticleByIdHandler,
  replaceArticleByIdHandler,
  deleteArticleByIdHandler,
  getArticlesCursorHandler,
  getArticlesStatsHandler
} from '../controllers/articlesController.mjs';
import { checkArticleAccess } from '../middlewares/articleAccess.mjs';
import { validateArticle } from '../middlewares/validateArticle.mjs';

const router = Router();

router.get('/', getArticlesHandler);
router.get('/cursor/list', checkArticleAccess, getArticlesCursorHandler);
router.get('/stats/summary', checkArticleAccess, getArticlesStatsHandler);
router.post('/', checkArticleAccess, validateArticle, postArticlesHandler);
router.get('/:articleId', checkArticleAccess, getArticleByIdHandler);
router.put('/:articleId', checkArticleAccess, validateArticle, putArticleByIdHandler);
router.patch('/:articleId', checkArticleAccess, validateArticle, replaceArticleByIdHandler);
router.delete('/:articleId', checkArticleAccess, deleteArticleByIdHandler);

export default router;
