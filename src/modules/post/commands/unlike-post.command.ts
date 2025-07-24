import { ICommand } from '@nestjs/cqrs';

export class UnlikePostCommand implements ICommand {
  constructor(
    public readonly postId: number,
    public readonly userId: bigint,
  ) {}
}
