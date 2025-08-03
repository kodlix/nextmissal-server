-- CreateTable
CREATE TABLE "post_views" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT,
    "postId" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastViewedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_views" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT,
    "eventId" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastViewedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_views_userId_postId_ipAddress_key" ON "post_views"("userId", "postId", "ipAddress");

-- CreateIndex
CREATE INDEX "post_views_ipAddress_idx" ON "post_views"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "event_views_userId_eventId_ipAddress_key" ON "event_views"("userId", "eventId", "ipAddress");

-- CreateIndex
CREATE INDEX "event_views_ipAddress_idx" ON "event_views"("ipAddress");

-- AddForeignKey
ALTER TABLE "post_views" ADD CONSTRAINT "post_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_views" ADD CONSTRAINT "post_views_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_views" ADD CONSTRAINT "event_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_views" ADD CONSTRAINT "event_views_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;