"use client";
import { useState } from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getPriceSavings } from "@/lib/f";
import { products } from "@/assets/assets";

const sortOptions = [
  { value: "savings", label: "Biggest Savings" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const Deals = () => {
  const [sortBy, setSortBy] = useState("savings");

  // Sort products by savings
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "savings":
        return getPriceSavings(b) - getPriceSavings(a);
      case "price-low":
        return (
          Math.min(...a.prices.map((p) => p.price)) -
          Math.min(...b.prices.map((p) => p.price))
        );
      case "price-high":
        return (
          Math.min(...b.prices.map((p) => p.price)) -
          Math.min(...a.prices.map((p) => p.price))
        );
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const totalSavings = products.reduce((acc, p) => acc + getPriceSavings(p), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge variant="deal" className="mb-4">
            Hot Deals
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Today's Best Deals
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Our AI scans thousands of products to find you the biggest savings.
            Updated every hour.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-success/10 border border-success/20">
            <span className="text-success font-bold text-lg">
              ${totalSavings}
            </span>
            <span className="text-muted-foreground">
              in total savings found
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Badge variant="secondary">{sortedProducts.length} deals</Badge>
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Deals;
