import axios from "axios";
import Products from "./Products";

async function FeatureSection() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/shop/product/allProducts`
    );

    return <Products product={res.data.products} />;
  } catch (error) {
    console.log("Error fetching products:", error);
    return <p className="text-red-500">Error fetching products</p>;
  }
}

export default FeatureSection;
