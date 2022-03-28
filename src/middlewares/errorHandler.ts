import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof Error) {
    status = 400;
    message = err.message;
  }

  return res.status(status).json({ error: message });
}
