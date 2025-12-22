"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Filter } from "lucide-react";

const categories = [
  "All Categories",
  "Programming & Development",
  "Business & Marketing",
  "Design & Creative",
  "Health & Fitness",
  "Language Learning",
  "Music & Arts",
  "Photography",
  "Data Science"
];

const levels = [
  "All Levels",
  "Beginner",
  "Intermediate",
  "Advanced"
];

const priceRanges = [
  "All Prices",
  "Free",
  "Under $50",
  "$50 - $100",
  "$100 - $200",
  "Above $200"
];

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    level: searchParams.get("level") || "",
    priceRange: searchParams.get("priceRange") || "",
  });

  const [localSearch, setLocalSearch] = useState(filters.search);

  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" &&
        !value.startsWith("All") &&
        value !== "All Categories" &&
        value !== "All Levels" &&
        value !== "All Prices") {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    const newUrl = queryString ? `/courses?${queryString}` : "/courses";

    router.push(newUrl, { scroll: false });
  }, [filters, router]);

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: localSearch }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      level: "",
      priceRange: "",
    });
    setLocalSearch("");
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value && value !== "" &&
    !value.startsWith("All") &&
    value !== "All Categories" &&
    value !== "All Levels" &&
    value !== "All Prices"
  );

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={handleKeyPress}
          className="pl-10 h-10 bg-background border-border focus-visible:ring-primary/20"
        />
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            Category
          </h3>
          <Select
            value={filters.category || "All Categories"}
            onValueChange={(value) =>
              setFilters(prev => ({
                ...prev,
                category: value === "All Categories" ? "" : value
              }))
            }
          >
            <SelectTrigger className="w-full bg-background border-input hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Level</h3>
          <Select
            value={filters.level || "All Levels"}
            onValueChange={(value) =>
              setFilters(prev => ({
                ...prev,
                level: value === "All Levels" ? "" : value
              }))
            }
          >
            <SelectTrigger className="w-full bg-background border-input hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Filter */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Price</h3>
          <Select
            value={filters.priceRange || "All Prices"}
            onValueChange={(value) =>
              setFilters(prev => ({
                ...prev,
                priceRange: value === "All Prices" ? "" : value
              }))
            }
          >
            <SelectTrigger className="w-full bg-background border-input hover:border-primary/50 transition-colors">
              <SelectValue placeholder="Select Price Range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters & Clear */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === "" || value.startsWith("All")) return null;
                return (
                  <Badge key={key} variant="secondary" className="px-2 py-1 text-xs gap-1">
                    {value}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => setFilters(prev => ({ ...prev, [key]: "" }))}
                    />
                  </Badge>
                )
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="w-full text-muted-foreground hover:text-destructive text-xs h-8"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}