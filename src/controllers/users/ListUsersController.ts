import { Request, Response } from 'express';
import { ListUsersService } from '../../services/users';

export class ListUsersController {
  async handle(req: Request, res: Response) {
    const { after, size } = req.query;
    const listUsersService = new ListUsersService(
      String(after ?? ''),
      Number(size) || 5
    );
    const page = await listUsersService.execute();
    return res.json({ ok: true, page });
  }
}
