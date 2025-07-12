import ProductComponent from "@/app/ShopComponents/ProductComponent";
import axios from "axios";

async function getProductById(id: string) {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/shop/product/singleProduct?Id=${id}`
    );
    return res.data.product;
  } catch (error) {
    console.error("Error fetching products", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  return (
    <>
      {product ? (
        <ProductComponent product={product} />
      ) : (
        <div>Product not found.</div>
      )}
    </>
  );
}
