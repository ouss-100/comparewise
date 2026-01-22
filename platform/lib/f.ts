import { Product, PriceSource } from "@/types/interf";

export const getBestPrice = (product: Product): PriceSource => {
  return product.prices.reduce((best, current) => 
    current.price < best.price ? current : best
  );
};

export const getPriceSavings = (product: Product): number => {
  const best = getBestPrice(product);
  if (best.originalPrice) {
    return best.originalPrice - best.price;
  }
  const highest = Math.max(...product.prices.map(p => p.originalPrice || p.price));
  return highest - best.price;
};
