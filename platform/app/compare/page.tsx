"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, X, Sparkles, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/NavBar";
import Footer from "@/components/Footer";
import { getBestPrice } from "@/lib/f";
import { Product } from "@/types/interf";
import { products } from "@/assets/assets";

const Compare = () => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([
    products[0],
    products[1],
  ]);

  const availableProducts = products.filter(
    (p) => !selectedProducts.some((sp) => sp.id === p.id),
  );

  const addProduct = (product: Product) => {
    if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const maxFeatures = Math.max(
    ...selectedProducts.map((p) => p.features.length),
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Compare Products
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select up to 4 products to compare side-by-side with AI-powered
            analysis.
          </p>
        </div>

        {/* AI Summary */}
        {selectedProducts.length >= 2 && (
          <div className="mb-12 p-6 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  AI Recommendation
                </h3>
                <p className="text-muted-foreground">
                  Based on our analysis,{" "}
                  <strong className="text-foreground">
                    {selectedProducts[0].name}
                  </strong>{" "}
                  offers the best value with a rating of{" "}
                  {selectedProducts[0].rating}/5 and a price of $
                  {getBestPrice(selectedProducts[0]).price}. It excels in{" "}
                  {selectedProducts[0].pros[0].toLowerCase()} while{" "}
                  {selectedProducts[1].name} is better for{" "}
                  {selectedProducts[1].pros[0].toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `200px repeat(${Math.min(selectedProducts.length + 1, 5)}, 1fr)`,
              }}
            >
              <div className="p-4" />
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative p-4 rounded-t-xl border border-border/50 bg-card/50"
                >
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-secondary hover:bg-destructive/20 hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Link href={`/product/${product.id}`} className="block">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                </div>
              ))}
              {selectedProducts.length < 4 && (
                <div className="p-4 rounded-t-xl border border-dashed border-border/50 flex flex-col items-center justify-center min-h-[280px]">
                  <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Add Product
                  </span>
                </div>
              )}
            </div>

            {/* Price Row */}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `200px repeat(${Math.min(selectedProducts.length + 1, 5)}, 1fr)`,
              }}
            >
              <div className="p-4 font-medium text-foreground">Best Price</div>
              {selectedProducts.map((product) => {
                const best = getBestPrice(product);
                return (
                  <div
                    key={product.id}
                    className="p-4 border-x border-border/50 bg-card/30"
                  >
                    <div className="text-2xl font-bold text-foreground">
                      ${best.price}
                    </div>
                    <Badge variant="price" className="mt-1">
                      {best.source}
                    </Badge>
                  </div>
                );
              })}
              {selectedProducts.length < 4 && <div className="p-4" />}
            </div>

            {/* Rating Row */}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `200px repeat(${Math.min(selectedProducts.length + 1, 5)}, 1fr)`,
              }}
            >
              <div className="p-4 font-medium text-foreground">Rating</div>
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border-x border-border/50 bg-card/30"
                >
                  <span className="text-lg font-semibold text-foreground">
                    {product.rating}/5
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({product.reviewCount.toLocaleString()})
                  </span>
                </div>
              ))}
              {selectedProducts.length < 4 && <div className="p-4" />}
            </div>

            {/* Features Rows */}
            {Array.from({ length: maxFeatures }).map((_, index) => (
              <div
                key={index}
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `200px repeat(${Math.min(selectedProducts.length + 1, 5)}, 1fr)`,
                }}
              >
                <div className="p-4 font-medium text-foreground">
                  {index === 0 ? "Features" : ""}
                </div>
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 border-x border-border/50 bg-card/30"
                  >
                    {product.features[index] ? (
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm text-muted-foreground">
                          {product.features[index]}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground/50">
                        -
                      </span>
                    )}
                  </div>
                ))}
                {selectedProducts.length < 4 && <div className="p-4" />}
              </div>
            ))}

            {/* Action Row */}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `200px repeat(${Math.min(selectedProducts.length + 1, 5)}, 1fr)`,
              }}
            >
              <div className="p-4" />
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 border-x border-b rounded-b-xl border-border/50 bg-card/30"
                >
                  <Button asChild variant="hero" className="w-full">
                    <Link href={`/product/${product.id}`}>
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              {selectedProducts.length < 4 && <div className="p-4" />}
            </div>
          </div>
        </div>

        {/* Add More Products */}
        {availableProducts.length > 0 && selectedProducts.length < 4 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Add to comparison
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {availableProducts.slice(0, 6).map((product) => (
                <button
                  key={product.id}
                  onClick={() => addProduct(product)}
                  className="p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/50 transition-all text-left group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-square object-cover rounded-lg mb-3"
                  />
                  <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    ${getBestPrice(product).price}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Compare;
