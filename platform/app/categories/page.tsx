"use client";

import { useParams } from "next/navigation"; // to get route params
import Link from "next/link"; // for links
import Header from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { categories, products } from "@/assets/assets";
import { ArrowRight } from "lucide-react";

const Categories = () => {
  const { categoryId } = useParams();

  // If specific category selected
  if (categoryId) {
    const category = categories.find((c) => c.id === categoryId);
    const categoryProducts = products.filter((p) => p.category === categoryId);

    if (!category) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Category Not Found
            </h1>
          </div>
          <Footer />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-primary">
                Categories
              </Link>
              <span>/</span>
              <span className="text-foreground">{category.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{category.icon}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {category.name}
                </h1>
                <p className="text-muted-foreground">
                  {category.productCount.toLocaleString()} products available
                </p>
              </div>
            </div>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">
                No products found in this category yet.
              </p>
              <Link href="/" className="text-primary hover:underline">
                Browse all products
              </Link>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  // All categories view
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Browse Categories
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore products across all categories and find the best deals with
            AI-powered price comparison.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group relative flex items-center gap-6 p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card transition-all duration-300"
            >
              <span className="text-6xl">{category.icon}</span>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h2>
                <p className="text-muted-foreground">
                  {category.productCount.toLocaleString()} products
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
