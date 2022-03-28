import { Request, Response } from 'express';
import { ListReceivedComplimentsService } from '../../services/compliments';

export class ListReceivedComplimentsController {
  async handle(req: Request, res: Response) {
    const { user_id } = req;
    const { after, size } = req.query;
    const listReceivedComplimentsService = new ListReceivedComplimentsService(
      user_id,
      String(after ?? ''),
      Number(size) || 5
    );
    const page = await listReceivedComplimentsService.execute();
    return res.json({ ok: true, page });
  }
}
