export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  prices: PriceSource[];
  rating: number;
  reviewCount: number;
  features: string[];
  pros: string[];
  cons: string[];
  availability: boolean;
  priceHistory: PriceHistoryPoint[];
}

export interface PriceSource {
  source: string;
  price: number;
  originalPrice?: number;
  url: string;
  inStock: boolean;
  shipping?: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  source: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}