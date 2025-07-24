import { ICommand } from '@nestjs/cqrs';

export class UnlikeCommentCommand implements ICommand {
  constructor(
    public readonly commentId: number,
    public readonly userId: bigint,
  ) {}
}
