import CategorySection from "../ShopComponents/Categories";
import Hero from "../ShopComponents/Hero";
import FeatureSection from "../ShopComponents/ProductFeatures";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="py-6">
          <div className="max-w-7xl mx-auto ">
            <Hero />
          </div>
        </section>
        <section className="max-w-7xl mx-auto bg-gray-50 p-4">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Shop by Categories
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <CategorySection />
            </div>
        </section>
        <section className="py-8">
          <div className="max-w-7xl mx-auto ">
            <FeatureSection />
          </div>
        </section>
      </main>
    </div>
  );
}
