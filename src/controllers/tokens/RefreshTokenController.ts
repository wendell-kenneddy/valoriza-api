import { Request, Response } from 'express';
import { RefreshTokenService } from '../../services/tokens';

export class RefreshTokenController {
  async handle(req: Request, res: Response) {
    const { refreshTokenId } = req.body;
    const refreshTokenService = new RefreshTokenService(refreshTokenId);
    const tokens = await refreshTokenService.execute();
    return res.json({ ok: true, ...tokens });
  }
}
