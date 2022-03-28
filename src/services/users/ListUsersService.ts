import { prisma } from '../../prisma';

export class ListUsersService {
  constructor(
    private readonly after?: string,
    private readonly size?: number
  ) {}

  async execute() {
    const page = await this.getPaginatedUsers();
    return page;
  }

  private async getPaginatedUsers() {
    const users = await this.getUsers();
    const page = {
      data: [...users],
      next: null as string | null
    };

    if (users.length > 0) {
      const lastUser = await this.getLastUser();
      const pageLastUserId = users[users.length - 1].id;
      lastUser?.id !== pageLastUserId && (page.next = pageLastUserId);
    }

    return page;
  }

  private async getUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        admin: true,
        createdAt: true,
        updatedAt: true
      },
      take: this.size,
      skip: this.after ? 1 : 0,
      orderBy: { createdAt: 'asc' },
      ...(this.after && { cursor: { id: this.after } })
    });
    return users;
  }

  private async getLastUser() {
    const user = await prisma.user.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    return user;
  }
}
