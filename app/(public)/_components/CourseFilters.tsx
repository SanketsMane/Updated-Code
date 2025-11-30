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
    <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses, topics, instructors..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select 
                value={filters.category || "All Categories"} 
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    category: value === "All Categories" ? "" : value 
                  }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select category" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select 
                value={filters.level || "All Levels"} 
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    level: value === "All Levels" ? "" : value 
                  }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select level" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <Select 
                value={filters.priceRange || "All Prices"} 
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    priceRange: value === "All Prices" ? "" : value 
                  }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select price range" />
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
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Active filters:</span>
              {filters.search && (
                <Badge variant="secondary" className="gap-1">
                  Search: {filters.search}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => {
                      setFilters(prev => ({ ...prev, search: "" }));
                      setLocalSearch("");
                    }}
                  />
                </Badge>
              )}
              {filters.category && (
                <Badge variant="secondary" className="gap-1">
                  {filters.category}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, category: "" }))}
                  />
                </Badge>
              )}
              {filters.level && (
                <Badge variant="secondary" className="gap-1">
                  {filters.level}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, level: "" }))}
                  />
                </Badge>
              )}
              {filters.priceRange && (
                <Badge variant="secondary" className="gap-1">
                  {filters.priceRange}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilters(prev => ({ ...prev, priceRange: "" }))}
                  />
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}