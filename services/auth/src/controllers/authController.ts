import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import prisma from '../prisma';

export const register = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        password: hashed,
        role: role || 'user',
      },
    });
    res.json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET || 'changeme',
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err });
  }
};
