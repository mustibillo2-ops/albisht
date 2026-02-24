-- Alter the OrderItem table so products can be removed even if they were part of past orders.
ALTER TABLE `OrderItem`
  DROP FOREIGN KEY `OrderItem_productId_fkey`;

ALTER TABLE `OrderItem`
  MODIFY `productId` INTEGER NULL;

ALTER TABLE `OrderItem`
  ADD CONSTRAINT `OrderItem_productId_fkey`
  FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

