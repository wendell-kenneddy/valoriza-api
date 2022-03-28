import { sign } from 'jsonwebtoken';

export class GenerateAccessTokenProvider {
  async execute(email: string, id: string) {
    const accessToken = sign(
      { email: email },
      process.env.JWT_SECRET as string,
      {
        subject: id,
        expiresIn: '15min'
      }
    );

    return accessToken;
  }
}
