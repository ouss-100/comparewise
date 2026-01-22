"use client";
import { ArrowRight, TrendingUp, Users, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/NavBar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import CategoryGrid from "@/components/CategoryGrid";
import FeatureSection from "@/components/FeatureSection";
import { products } from "@/assets/assets";

const stats = [
  { icon: Package, value: "50K+", label: "Products" },
  { icon: TrendingUp, value: "$2.5M", label: "Saved" },
  { icon: Users, value: "100K+", label: "Users" },
];

export default function Home() {
  const trendingProducts = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 pt-20 pb-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm text-muted-foreground">
                AI-powered price comparison
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight animate-slide-up">
              Compare Products.
              <br />
              <span className="gradient-text">
                Find the Best Price with AI.
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              Our intelligent platform scans thousands of retailers to find you
              the best deals, complete with AI-powered recommendations and price
              history.
            </p>

            {/* Search Bar */}
            <div
              className="max-w-2xl mx-auto animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <SearchBar size="large" />
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap justify-center gap-8 pt-8 animate-slide-up"
              style={{ animationDelay: "300ms" }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/50">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Shop by Category
              </h2>
              <p className="text-muted-foreground mt-1">
                Browse products across all categories
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/categories">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Trending Deals
              </h2>
              <p className="text-muted-foreground mt-1">
                Best prices found by our AI
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/deals">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <FeatureSection />

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-linear-to-r from-primary/20 via-primary/10 to-accent/10 border border-primary/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(174_72%_56%/0.15),transparent_50%)]" />
            <div className="relative px-8 py-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Start Saving?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of smart shoppers who use PriceWise to find the
                best deals every day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="xl">
                  Get Started Free
                </Button>
                <Button variant="outline" size="xl">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
