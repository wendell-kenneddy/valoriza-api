import { prisma } from '../../prisma';

export class CreateTagService {
  constructor(private readonly name: string) {}

  async execute() {
    await this.checkIfTagAlreadyExists();
    const tag = await this.createTag();
    return tag;
  }

  private async createTag() {
    const tag = await prisma.tag.create({
      data: { name: this.name }
    });
    return tag;
  }

  private async checkIfTagAlreadyExists() {
    const tag = await prisma.tag.findUnique({ where: { name: this.name } });
    if (tag) throw new Error(`Tag ${this.name} Already Exists`);
  }
}
