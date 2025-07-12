-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('VISA', 'MASTERCARD');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('processing', 'accepted');

-- CreateTable
CREATE TABLE "Login" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Login_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Register" (
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "confirmPassword" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL,
    "refreshToken" TEXT,
    "stripeCustomerId" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImages" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sizes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistItems" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "WishlistItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "cartId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "addressType" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "country" TEXT NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savedCard" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "customerId" TEXT NOT NULL,
    "stripePaymentMethodId" TEXT NOT NULL,
    "expiryMonth" INTEGER NOT NULL,
    "expiryYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "savedCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "customerId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "OrderType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductSizes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductSizes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProductColors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductColors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Register_email_key" ON "Register"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_name_key" ON "Stock"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_categoryId_key" ON "Stock"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItems_customerId_productId_key" ON "WishlistItems"("customerId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_customerId_key" ON "Cart"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_productId_key" ON "CartItem"("productId");

-- CreateIndex
CREATE INDEX "savedCard_customerId_idx" ON "savedCard"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "savedCard_customerId_stripePaymentMethodId_key" ON "savedCard"("customerId", "stripePaymentMethodId");

-- CreateIndex
CREATE INDEX "_ProductSizes_B_index" ON "_ProductSizes"("B");

-- CreateIndex
CREATE INDEX "_ProductColors_B_index" ON "_ProductColors"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImages" ADD CONSTRAINT "ProductImages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colors" ADD CONSTRAINT "Colors_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItems" ADD CONSTRAINT "WishlistItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItems" ADD CONSTRAINT "WishlistItems_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savedCard" ADD CONSTRAINT "savedCard_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSizes" ADD CONSTRAINT "_ProductSizes_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductSizes" ADD CONSTRAINT "_ProductSizes_B_fkey" FOREIGN KEY ("B") REFERENCES "Sizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductColors" ADD CONSTRAINT "_ProductColors_A_fkey" FOREIGN KEY ("A") REFERENCES "Colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductColors" ADD CONSTRAINT "_ProductColors_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
