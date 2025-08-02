import { Complaint, ComplaintStatus, ContentType } from '@prisma/client';

export class ComplaintEntity implements Complaint {
  id: number;
  contentId: string;
  contentType: ContentType;
  reason: string;
  details: string;
  reporterUserId: bigint;
  status: ComplaintStatus;
  createdAt: Date;
  updatedAt: Date;
}
