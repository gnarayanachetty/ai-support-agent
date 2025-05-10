import { Request, Response } from 'express';
import prisma from '../prisma';

export const createArticle = async (req: Request, res: Response) => {
  const { title, content, embedding } = req.body;
  try {
    const article = await prisma.article.create({
      data: { title, content, embedding },
    });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create article', error: err });
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const article = await prisma.article.findUnique({ where: { id: Number(req.params.id) } });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get article', error: err });
  }
};

export const listArticles = async (_req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list articles', error: err });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const article = await prisma.article.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(article);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    await prisma.article.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err });
  }
};

// Stub: Search articles by embedding (to be implemented with vector DB)
export const searchArticles = async (req: Request, res: Response) => {
  // For now, just return all articles
  try {
    const articles = await prisma.article.findMany();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err });
  }
};
