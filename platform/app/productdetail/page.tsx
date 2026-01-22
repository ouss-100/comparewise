"use client";

import { useParams } from "next/navigation"; // to get route params
import Link from "next/link"; // for links
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Bell,
  Share2,
  Check,
  X,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/NavBar";
import Footer from "@/components/Footer";
import PriceChart from "@/components/PriceChart";
import ProductCard from "@/components/ProductCard";
import { getBestPrice, getPriceSavings } from "@/lib/f";
import { products } from "@/assets/assets";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <Button asChild variant="hero">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const bestPrice = getBestPrice(product);
  const savings = getPriceSavings(product);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
        </div>

        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30">
            {savings > 0 && (
              <Badge
                variant="deal"
                className="absolute top-4 left-4 z-10 gap-1"
              >
                <TrendingDown className="h-3 w-3" />
                Save ${savings}
              </Badge>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-3 capitalize">
                {product.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">
                    {product.rating}
                  </span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            {/* Best Price */}
            <div className="p-6 rounded-xl bg-card border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Best Price</span>
                <Badge variant="price">{bestPrice.source}</Badge>
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-foreground">
                  ${bestPrice.price}
                </span>
                {bestPrice.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${bestPrice.originalPrice}
                  </span>
                )}
              </div>
              {bestPrice.shipping && (
                <p className="text-sm text-muted-foreground mb-4">
                  {bestPrice.shipping} shipping
                </p>
              )}
              <div className="flex gap-3">
                <Button asChild variant="hero" className="flex-1" size="lg">
                  <a
                    href={bestPrice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Go to {bestPrice.source}
                  </a>
                </Button>
                <Button variant="outline" size="lg">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Key Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Price Comparison */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Compare Prices
          </h2>
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Store
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Shipping
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {product.prices.map((price, index) => (
                  <tr
                    key={index}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-foreground">
                          {price.source}
                        </span>
                        {price.price === bestPrice.price && (
                          <Badge variant="deal" className="text-xs">
                            Best Price
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-foreground">
                          ${price.price}
                        </span>
                        {price.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${price.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {price.shipping || "Standard"}
                    </td>
                    <td className="px-6 py-4">
                      {price.inStock ? (
                        <Badge variant="success" className="gap-1">
                          <Check className="h-3 w-3" /> In Stock
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <X className="h-3 w-3" /> Out of Stock
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        disabled={!price.inStock}
                      >
                        <a
                          href={price.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Store <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Price History */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Price History
          </h2>
          <div className="p-6 rounded-xl border border-border/50 bg-card/50">
            <PriceChart data={product.priceHistory} />
          </div>
        </section>

        {/* AI Analysis */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border/50 bg-card/50">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Check className="h-5 w-5 text-success" /> Pros
              </h3>
              <ul className="space-y-3">
                {product.pros.map((pro, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <X className="h-5 w-5 text-destructive" /> Cons
              </h3>
              <ul className="space-y-3">
                {product.cons.map((con, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <X className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
