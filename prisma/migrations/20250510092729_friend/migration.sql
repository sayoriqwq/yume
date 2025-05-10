/*
  Warnings:

  - You are about to drop the column `name` on the `FriendLink` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `FriendLink` table. All the data in the column will be lost.
  - Added the required column `link` to the `FriendLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `FriendLink` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siteName` to the `FriendLink` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `FriendLink` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatar` on table `FriendLink` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FriendLink" DROP COLUMN "name",
DROP COLUMN "url",
ADD COLUMN     "link" TEXT NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "siteName" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "avatar" SET NOT NULL;
