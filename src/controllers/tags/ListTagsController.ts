import { Request, Response } from 'express';
import { ListTagsService } from '../../services/tags';

export class ListTagsController {
  async handle(req: Request, res: Response) {
    const { after, size } = req.query;
    const listTagsService = new ListTagsService(
      String(after ?? ''),
      Number(size) || 5
    );
    const page = await listTagsService.execute();
    return res.json({ ok: true, page });
  }
}
