import { Request, Response } from 'express';
import { ListSentComplimentsService } from '../../services/compliments';

export class ListSentComplimentsController {
  async handle(req: Request, res: Response) {
    const { user_id } = req;
    const { after, size } = req.query;
    const listSentComplimentsService = new ListSentComplimentsService(
      user_id,
      String(after ?? ''),
      Number(size) || 5
    );
    const page = await listSentComplimentsService.execute();
    return res.json({ ok: true, page });
  }
}
