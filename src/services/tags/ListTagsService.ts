import { prisma } from '../../prisma';

export class ListTagsService {
  constructor(
    private readonly after?: string,
    private readonly size?: number
  ) {}

  async execute() {
    const page = await this.getPaginatedTags();
    return page;
  }

  private async getPaginatedTags() {
    const tags = await this.getTags();
    const page = { data: [...tags], next: null as string | null };

    if (tags.length > 0) {
      const pageLastTagId = tags[tags.length - 1].id;
      const lastTag = await this.getLastTag();
      pageLastTagId === lastTag?.id && (page.next = pageLastTagId);
    }

    return page;
  }

  private async getTags() {
    const tags = await prisma.tag.findMany({
      select: {
        name: true,
        id: true,
        updatedAt: true,
        createdAt: true
      },
      skip: this.after ? 1 : 0,
      take: this.size,
      orderBy: { createdAt: 'asc' },
      ...(this.after && { cursor: { id: this.after } })
    });
    return tags;
  }

  private async getLastTag() {
    const lastTag = await prisma.tag.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    return lastTag;
  }
}
