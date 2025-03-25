/*
  Warnings:

  - You are about to drop the column `nameEn` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `nameTr` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `nameTr` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `nameEn` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `nameTr` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SubCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_nameEn_key";

-- DropIndex
DROP INDEX "Category_nameTr_key";

-- DropIndex
DROP INDEX "Tag_nameEn_key";

-- DropIndex
DROP INDEX "Tag_nameTr_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "nameEn",
DROP COLUMN "nameTr",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "nameEn",
DROP COLUMN "nameTr",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "nameEn",
DROP COLUMN "nameTr",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_value_key" ON "Tag"("value");
