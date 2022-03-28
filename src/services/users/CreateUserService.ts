import { validate } from 'isemail';
import { prisma } from '../../prisma';
import { hashSync } from 'bcryptjs';

interface IRequest {
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

export class CreateUserService {
  private readonly name: string = '';
  private readonly email: string = '';
  private readonly password: string = '';
  private readonly admin: boolean = false;

  constructor({ name, email, password, admin = false }: IRequest) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.admin = admin;
  }

  async execute() {
    await this.checkIfUserIsValid();

    const user = await this.createUser();
    return user;
  }

  private async createUser() {
    const hashedPassword = this.generateHashedPassword();
    const data = {
      name: this.name,
      email: this.email,
      password: hashedPassword,
      admin: this.admin
    };
    const user = await prisma.user.create({ data });
    return user;
  }

  private generateHashedPassword() {
    const hashedPassword = hashSync(this.password, 8);
    return hashedPassword;
  }

  private checkIfEmailIsValid() {
    const isValidEmail = validate(this.email);
    if (!isValidEmail) throw new Error('Email Invalid');
  }

  private async checkIfUserAlreadyExists() {
    let user = await prisma.user.findUnique({
      where: { email: this.email }
    });

    if (user) throw new Error('User Already Exists');
  }

  private async checkIfUserIsValid() {
    this.checkIfEmailIsValid();
    await this.checkIfUserAlreadyExists();
  }
}
