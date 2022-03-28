import { RefreshToken } from '@prisma/client';
import dayjs from 'dayjs';
import { prisma } from '../../prisma';
import {
  GenerateAccessTokenProvider,
  GenerateRefreshTokenProvider
} from '../../providers';

export class RefreshTokenService {
  private readonly generateAccessTokenProvider =
    new GenerateAccessTokenProvider();

  constructor(private readonly refreshTokenId: string) {}

  async execute() {
    const refreshToken = await this.getRefreshTokenIfExists();
    const accessToken = await this.generateAccessTokenProvider.execute(
      refreshToken.user.email,
      refreshToken.user.id
    );

    if (this.checkIfTokenIsExpired(refreshToken.expiresIn)) {
      const newRefreshToken = await this.generateNewIfIsExpired(
        refreshToken.userId
      );
      return {
        accessToken,
        refreshToken: {
          id: newRefreshToken.id,
          expiresIn: newRefreshToken.expiresIn,
          userId: newRefreshToken.userId
        }
      };
    }

    return { accessToken };
  }

  private async getRefreshTokenIfExists() {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { id: this.refreshTokenId },
      include: { user: true }
    });

    if (!refreshToken) throw new Error('Invalid Refresh Token');

    return refreshToken;
  }

  private async generateNewIfIsExpired(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
    const generateRefreshTokenProvider = new GenerateRefreshTokenProvider();
    const newRefreshToken = await generateRefreshTokenProvider.execute(userId);
    return newRefreshToken;
  }

  private checkIfTokenIsExpired(expiresIn: number) {
    const isExpired = dayjs().isAfter(dayjs.unix(expiresIn));
    return isExpired;
  }
}
