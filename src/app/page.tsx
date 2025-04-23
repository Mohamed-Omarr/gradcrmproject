import Hero from "./ShopComponents/Hero";
import FeatureSection from "./ShopComponents/ProductFeatures";
import ShopByCategories from "./ShopComponents/ShopByCategories";

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-4 md:px-10 lg:px-20 py-6">
      <div className="grid grid-cols-1 gap-y-10">
        <Hero />
        <ShopByCategories />
        <FeatureSection />
      </div>
    </main>
  );
}

