"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Sparkles, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  size?: "default" | "large";
  showSuggestions?: boolean;
}

const suggestions = [
  "Best noise canceling headphones under $300",
  "MacBook Air vs MacBook Pro comparison",
  "Top rated OLED TVs 2024",
  "Affordable running shoes with good reviews",
];

const SearchBar = ({
  size = "default",
  showSuggestions = true,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div
          className={`relative flex items-center gap-2 ${
            size === "large"
              ? "rounded-2xl bg-secondary/50 backdrop-blur-lg border border-border/50 p-2"
              : ""
          }`}
        >
          <div className="relative flex-1">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground ${
                size === "large" ? "h-5 w-5" : "h-4 w-4"
              }`}
            />
            <Input
              type="text"
              placeholder="Search products or ask AI for recommendations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              className={`pl-12 pr-4 ${
                size === "large"
                  ? "h-14 text-base rounded-xl border-0 bg-transparent focus-visible:ring-0"
                  : "h-12"
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              variant="hero"
              size={size === "large" ? "lg" : "default"}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Search</span>
            </Button>
          </div>
        </div>
      </form>

      {/* AI Suggestions */}
      {showSuggestions && focused && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl p-4 shadow-lg animate-fade-in z-50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              AI Suggestions
            </span>
          </div>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch(suggestion);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
