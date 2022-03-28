import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authString = req.headers.authorization;

  if (!authString) return res.status(401).end();

  // ['Bearer', 'token']
  const [, token] = authString.split(' ');

  try {
    const { sub } = verify(token, process.env.JWT_SECRET as string);
    req.user_id = String(sub);
    return next();
  } catch (error) {
    return res.status(401).end();
  }
}
