import { Request, Response } from 'express';
import { CreateComplimentService } from '../../services/compliments';

export class CreateComplimentController {
  async handle(req: Request, res: Response) {
    const { user_id } = req;
    const { user_receiver_id, tag_id, message } = req.body;
    const createComplimentService = new CreateComplimentService({
      tag_id,
      user_sender_id: user_id,
      user_receiver_id,
      message
    });
    const compliment = await createComplimentService.execute();
    return res.json({ ok: true, compliment });
  }
}
