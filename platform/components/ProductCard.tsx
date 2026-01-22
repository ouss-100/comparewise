import Link from "next/link";
import { Star, ExternalLink, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/interf";
import { getBestPrice, getPriceSavings } from "@/lib/f";

interface ProductCardProps {
  product: Product;
  showCompare?: boolean;
}

const ProductCard = ({ product, showCompare = true }: ProductCardProps) => {
  const bestPrice = getBestPrice(product);
  const savings = getPriceSavings(product);

  return (
    <div className="group relative rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      {/* Best Deal Badge */}
      {savings > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="deal" className="gap-1">
            <TrendingDown className="h-3 w-3" />
            Save ${savings}
          </Badge>
        </div>
      )}

      {/* Image */}
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary/30">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <Badge variant="secondary" className="text-xs capitalize">
          {product.category}
        </Badge>

        {/* Title */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="text-sm font-medium text-foreground">{product.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Prices */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">${bestPrice.price}</span>
            {bestPrice.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${bestPrice.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Best price at</span>
            <Badge variant="price">{bestPrice.source}</Badge>
          </div>
        </div>

        {/* Price Sources Preview */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Compare from {product.prices.length} stores</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="hero" className="flex-1" size="sm">
            <a href={bestPrice.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              View Deal
            </a>
          </Button>
          {showCompare && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/product/${product.id}`}>Details</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
