import { Request, Response } from 'express';
import { AuthenticateService } from '../../services/auth';

export class AuthenticateController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;
    const authenticateService = new AuthenticateService({ email, password });
    const tokens = await authenticateService.execute();
    return res.json({ ok: true, ...tokens });
  }
}
