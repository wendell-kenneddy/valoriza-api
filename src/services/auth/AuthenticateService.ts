import { compareSync } from 'bcryptjs';
import { validate } from 'isemail';
import { prisma } from '../../prisma';
import {
  GenerateAccessTokenProvider,
  GenerateRefreshTokenProvider
} from '../../providers';

interface IAuthRequest {
  email: string;
  password: string;
}

export class AuthenticateService {
  private readonly email: string = '';
  private readonly password: string = '';
  private readonly generateAccessTokenProvider =
    new GenerateAccessTokenProvider();
  private readonly generateRefreshTokenProvider =
    new GenerateRefreshTokenProvider();

  constructor({ email, password }: IAuthRequest) {
    this.email = email;
    this.password = password;
  }

  async execute() {
    this.checkIfEmailIsValid();
    const user = await this.getUserIfExists();
    this.checkIfPasswordsMatch(user.password);
    const accessToken = await this.generateAccessTokenProvider.execute(
      user.email,
      user.id
    );
    await this.deleteOldRefreshTokens(user.id);
    const refreshToken = await this.generateRefreshToken(user.id);
    return { accessToken, refreshToken };
  }

  private async generateRefreshToken(id: string) {
    const refreshToken = await this.generateRefreshTokenProvider.execute(id);
    return refreshToken;
  }

  private async getUserIfExists() {
    const user = await prisma.user.findUnique({ where: { email: this.email } });
    if (!user) throw new Error('Invalid Email/Password');
    return user;
  }

  private checkIfPasswordsMatch(hashedPassword: string) {
    const passwordsMatch = compareSync(this.password, hashedPassword);
    if (!passwordsMatch) throw new Error('Invalid Email/Password');
  }

  private checkIfEmailIsValid() {
    const isEmailValid = validate(this.email);
    if (!isEmailValid) throw new Error('Invalid Email/Password');
  }

  private async deleteOldRefreshTokens(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
