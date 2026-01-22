import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/assets/assets";

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.id}`}
          className="group relative flex flex-col items-center gap-3 p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-card transition-all duration-300"
        >
          <span className="text-4xl">{category.icon}</span>
          <div className="text-center">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {category.productCount.toLocaleString()} products
            </p>
          </div>
          <ArrowRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all transform translate-x-0 group-hover:translate-x-1" />
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
