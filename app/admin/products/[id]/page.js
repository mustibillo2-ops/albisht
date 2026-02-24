import prisma from "@/lib/prisma";
import ProductForm from "@/app/admin/products/_components/ProductForm";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const productId = Number(id);
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { nameAr: "asc" },
  });

  // Convert Decimal to number for Client Component
  const productForClient = {
    ...product,
    price: Number(product.price),
  };

  return <ProductForm categories={categories} product={productForClient} />;
}

