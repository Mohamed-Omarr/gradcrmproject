import BestSeller from "./ShopComponents/BestSeller";
import Hero from "./ShopComponents/Hero";
import NewArrivals from "./ShopComponents/NewArrivals";
import ShopByCategories from "./ShopComponents/ShopByCategories";

export default function Home() {
  return (
    <div className=" min-h-screen">
      <Hero />
      <ShopByCategories/>
      <NewArrivals/>
      <BestSeller/>
    </div>
  );
}
