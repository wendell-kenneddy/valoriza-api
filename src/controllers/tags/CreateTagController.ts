import { Request, Response } from 'express';
import { CreateTagService } from '../../services/tags';

export class CreateTagController {
  async handle(req: Request, res: Response) {
    const { name } = req.body;
    const createTagService = new CreateTagService(name);
    const tag = await createTagService.execute();
    return res.json({ ok: true, tag });
  }
}
