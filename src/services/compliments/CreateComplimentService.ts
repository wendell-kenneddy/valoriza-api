import { prisma } from '../../prisma';

interface IComplimentRequest {
  tag_id: string;
  user_sender_id: string;
  user_receiver_id: string;
  message: string;
}

export class CreateComplimentService {
  private readonly tag_id: string = '';
  private readonly user_sender_id: string = '';
  private readonly user_receiver_id: string = '';
  private readonly message: string = '';

  constructor({
    tag_id,
    user_sender_id,
    user_receiver_id,
    message
  }: IComplimentRequest) {
    this.tag_id = tag_id;
    this.user_sender_id = user_sender_id;
    this.user_receiver_id = user_receiver_id;
    this.message = message;
  }

  async execute() {
    await this.validate();
    const user = await this.createUser();
    return user;
  }

  private async createUser() {
    const user = await prisma.compliment.create({
      data: {
        tag_id: this.tag_id,
        userReceiverId: this.user_receiver_id,
        userSenderId: this.user_sender_id,
        message: this.message
      }
    });
    return user;
  }

  private async checkIfUserReceiverExists() {
    const userReceiver = await prisma.user.findUnique({
      where: { id: this.user_receiver_id }
    });

    if (!userReceiver) throw new Error('Invalid User Receiver');
  }

  private checkIfUserReceiverAndSenderAreEqual() {
    if (this.user_receiver_id === this.user_sender_id) {
      throw new Error('Invalid User Receiver');
    }
  }

  private async validate() {
    this.checkIfUserReceiverAndSenderAreEqual();
    await this.checkIfUserReceiverExists();
  }
}
