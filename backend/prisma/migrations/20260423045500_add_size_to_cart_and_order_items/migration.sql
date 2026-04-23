-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN "size" TEXT;

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN "size" TEXT;

-- DropIndex
DROP INDEX "cart_items_cartId_productId_key";

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_size_key" ON "cart_items"("cartId", "productId", "size");
