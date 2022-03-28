import { prisma } from '../../prisma';

export class ListSentComplimentsService {
  constructor(
    private readonly user_id: string,
    private readonly after?: string,
    private readonly size?: number
  ) {}

  async execute() {
    await this.checkIfUserExists();
    const page = await this.getPaginatedCompliments();
    return page;
  }

  private async getPaginatedCompliments() {
    const compliments = await this.getCompliments();
    const page = { data: [...compliments], next: null as string | null };

    if (compliments.length > 0) {
      const pageLastComplimentId = compliments[compliments.length - 1].id;
      const lastCompliment = await this.getLastCompliment();
      pageLastComplimentId !== lastCompliment?.id &&
        (page.next = pageLastComplimentId);
    }

    return page;
  }

  private async getCompliments() {
    const compliments = await prisma.compliment.findMany({
      where: { userSenderId: this.user_id },
      select: {
        id: true,
        message: true,
        userReceiverId: true,
        tag_id: true
      },
      skip: this.after ? 1 : 0,
      take: this.size,
      orderBy: { createdAt: 'asc' },
      ...(this.after && { cursor: { id: this.after } })
    });
    return compliments;
  }

  private async getLastCompliment() {
    const lastCompliment = await prisma.compliment.findFirst({
      where: { userSenderId: this.user_id },
      orderBy: { createdAt: 'desc' }
    });
    return lastCompliment;
  }

  private async checkIfUserExists() {
    const user = await prisma.user.findUnique({ where: { id: this.user_id } });
    if (!user) throw new Error('User Does Not Exists');
  }
}
