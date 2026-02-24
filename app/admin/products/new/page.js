import prisma from "@/lib/prisma";
import ProductForm from "@/app/admin/products/_components/ProductForm";

export const revalidate = 0;

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { nameAr: "asc" },
  });

  return <ProductForm categories={categories} />;
}

