import { Request, Response } from 'express';
import prisma from '../prisma';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.userProfile.findMany();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await prisma.userProfile.findUnique({ where: { id: Number(req.params.id) } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.userProfile.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Update failed', error: err });
  }
};
