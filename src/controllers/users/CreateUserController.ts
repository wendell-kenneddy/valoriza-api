import { Request, Response } from 'express';
import { CreateUserService } from '../../services/users';

export class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password, admin } = req.body;

    const createUserService = new CreateUserService({
      name,
      email,
      password,
      admin
    });

    const user = await createUserService.execute();
    return res.json({ user });
  }
}
