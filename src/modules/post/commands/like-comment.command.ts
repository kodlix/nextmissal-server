import { ICommand } from '@nestjs/cqrs';

export class LikeCommentCommand implements ICommand {
  constructor(
    public readonly commentId: number,
    public readonly userId: bigint,
  ) {}
}
