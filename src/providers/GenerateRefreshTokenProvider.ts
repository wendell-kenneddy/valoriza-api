import dayjs from 'dayjs';
import { prisma } from '../prisma';

export class GenerateRefreshTokenProvider {
  async execute(userId: string) {
    const expiresIn = dayjs().add(1, 'day').unix();
    const refreshToken = await prisma.refreshToken.create({
      data: {
        userId,
        expiresIn
      }
    });
    return refreshToken;
  }
}
