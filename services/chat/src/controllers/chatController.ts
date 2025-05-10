import { Request, Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';
import prisma from '../prisma';

export const createChatSession = async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;
  try {
    const chat = await prisma.chatSession.create({
      data: { userId: Number(userId) },
    });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create chat session', error: err });
  }
};

export const getChatSession = async (req: AuthRequest, res: Response) => {
  try {
    const chat = await prisma.chatSession.findUnique({
      where: { id: Number(req.params.id) },
      include: { messages: true },
    });
    if (!chat) return res.status(404).json({ message: 'Chat session not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get chat session', error: err });
  }
};

export const addMessageToSession = async (req: AuthRequest, res: Response) => {
  const { sender, content } = req.body;
  try {
    const message = await prisma.chatMessage.create({
      data: {
        chatSessionId: Number(req.params.id),
        sender,
        content,
      },
    });
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add message', error: err });
  }
};

export const getUserChats = async (req: AuthRequest, res: Response) => {
  try {
    const chats = await prisma.chatSession.findMany({
      where: { userId: Number(req.params.userId) },
      include: { messages: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user chats', error: err });
  }
};
