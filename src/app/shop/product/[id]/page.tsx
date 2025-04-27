import axios from "axios";
import ProductComponent from "@/app/ShopComponents/ProductComponent";

async function getProductById(id: string) {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/shop/product/productMethods?itemId=${id}`
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
  params: { id: string };
}) {
  const { id } = await params; // Await params here
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
