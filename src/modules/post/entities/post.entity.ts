import { AggregateRoot } from '@nestjs/cqrs';
import { Post, Privacy, Priority } from '@prisma/client';

export class PostEntity extends AggregateRoot implements Post {
  id: number;
  title: string;
  content: string;
  media: string[];
  authorId: bigint;
  isDeleted: boolean;
  privacy: Privacy;
  hashtags: string;
  mentions: string;
  isAnnouncement: boolean;
  priority: Priority;
  isPinned: boolean;
  attachments: string;
  startsAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(properties: Partial<PostEntity>) {
    super();
    Object.assign(this, properties);
  }

  get props(): Post {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      media: this.media,
      authorId: this.authorId,
      isDeleted: this.isDeleted,
      privacy: this.privacy,
      hashtags: this.hashtags,
      mentions: this.mentions,
      isAnnouncement: this.isAnnouncement,
      priority: this.priority,
      isPinned: this.isPinned,
      attachments: this.attachments,
      startsAt: this.startsAt,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
