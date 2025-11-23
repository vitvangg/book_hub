-- DropForeignKey
ALTER TABLE "public"."post_tag" DROP CONSTRAINT "post_tag_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."post_tag" DROP CONSTRAINT "post_tag_tag_id_fkey";

-- AddForeignKey
ALTER TABLE "post_tag" ADD CONSTRAINT "post_tag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("post_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_tag" ADD CONSTRAINT "post_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;
