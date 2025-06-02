import CategorySection from "../ShopComponents/Categories";
import Hero from "../ShopComponents/Hero";
import FeatureSection from "../ShopComponents/ProductFeatures";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <Hero />
          </div>
        </section>
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Shop by Categories
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <CategorySection />
            </div>
          </div>
        </section>
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <FeatureSection />
          </div>
        </section>
      </main>
    </div>
  );
}
