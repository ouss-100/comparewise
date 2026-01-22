import { Sparkles, TrendingDown, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Comparison",
    description: "Our AI analyzes thousands of products to find you the best deals based on price, features, and reviews.",
  },
  {
    icon: TrendingDown,
    title: "Price Tracking",
    description: "Track price history and get alerts when prices drop on your favorite products.",
  },
  {
    icon: Shield,
    title: "Trusted Sources",
    description: "We only aggregate data from verified retailers to ensure accuracy and reliability.",
  },
  {
    icon: Zap,
    title: "Real-Time Updates",
    description: "Prices are updated every hour to ensure you always see the latest deals.",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="gradient-text">PriceWise</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine cutting-edge AI with real-time data to help you make smarter purchasing decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
