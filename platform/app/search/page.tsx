"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, ArrowLeft } from "lucide-react";
import Header from "@/components/NavBar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/assets/assets";

const Search = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  // Simple search filter
  const results = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Search Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="max-w-2xl mb-8">
            <SearchBar size="large" showSuggestions={false} />
          </div>

          {query && (
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <p className="text-muted-foreground">
                AI found{" "}
                <span className="text-foreground font-semibold">
                  {results.length}
                </span>{" "}
                results for "<span className="text-foreground">{query}</span>"
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              No results found
            </h2>
            <p className="text-muted-foreground mb-8">
              Try adjusting your search or browse our categories
            </p>
            <Link href="/categories" className="text-primary hover:underline">
              Browse Categories
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Search;
