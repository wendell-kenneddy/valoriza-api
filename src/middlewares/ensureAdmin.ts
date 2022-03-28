import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { prisma } from '../prisma';

export async function ensureAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user_id } = req;
  const { admin } = (await prisma.user.findUnique({
    where: { id: user_id }
  })) as User;

  if (admin) return next();

  return res.status(401).json({ ok: false, error: 'Unauthorized' });
}
