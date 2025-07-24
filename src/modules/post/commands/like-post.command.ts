import { ICommand } from '@nestjs/cqrs';

export class LikePostCommand implements ICommand {
  constructor(
    public readonly postId: number,
    public readonly userId: bigint,
  ) {}
}
