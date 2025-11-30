"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Filter,
  X,
  Star,
  Clock,
  DollarSign,
  Users,
  BookOpen,
  Video,
  Award,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

interface SearchFilters {
  query: string;
  categories: string[];
  levels: string[];
  duration: string[];
  priceRange: [number, number];
  rating: number;
  isFree: boolean;
  hasVideo: boolean;
  hasCertificate: boolean;
  isLiveSession: boolean;
  sortBy: string;
  sortOrder: string;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onFilterChange: (filters: SearchFilters) => void;
  placeholder?: string;
  initialFilters?: Partial<SearchFilters>;
  isLoading?: boolean;
  resultCount?: number;
  showMobileSheet?: boolean;
  categories?: string[];
  levels?: string[];
  durations?: string[];
}

export function AdvancedSearch({
  onSearch,
  onFilterChange,
  placeholder = "Search for courses, tutorials, and sessions...",
  initialFilters = {},
  isLoading = false,
  resultCount = 0,
  showMobileSheet = true,
  categories: propCategories,
  levels: propLevels,
  durations: propDurations
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    categories: [],
    levels: [],
    duration: [],
    priceRange: [0, 500],
    rating: 0,
    isFree: false,
    hasVideo: false,
    hasCertificate: false,
    isLiveSession: false,
    sortBy: "relevance",
    sortOrder: "desc",
    ...initialFilters,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Use provided categories/levels or fallback to defaults
  const categories = propCategories || ["Web Development", "Data Science", "Design", "Business", "Marketing"];
  const levels = propLevels || ["Beginner", "Intermediate", "Advanced"];
  const durations = propDurations || ["0-2 hours", "2-6 hours", "6+ hours"];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onFilterChange(filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filters, onFilterChange]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.categories.length +
      filters.levels.length +
      filters.duration.length +
      (filters.rating > 0 ? 1 : 0) +
      (filters.isFree ? 1 : 0) +
      (filters.hasVideo ? 1 : 0) +
      (filters.hasCertificate ? 1 : 0) +
      (filters.isLiveSession ? 1 : 0) +
      (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0)
    );
  }, [filters]);

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(filters);
    if (filters.query.trim()) {
      setRecentSearches(prev => [filters.query, ...prev.filter(s => s !== filters.query)].slice(0, 5));
    }
  }, [filters, onSearch]);

  const clearFilters = useCallback(() => {
    setFilters({
      query: filters.query, // Keep the search query
      categories: [],
      levels: [],
      duration: [],
      priceRange: [0, 500],
      rating: 0,
      isFree: false,
      hasVideo: false,
      hasCertificate: false,
      isLiveSession: false,
      sortBy: "relevance",
      sortOrder: "desc"
    });
  }, [filters.query]);

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 pr-20 h-12 text-base"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {/* Desktop Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="hidden lg:flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            
            {/* Mobile Filter Sheet */}
            {showMobileSheet && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4" />
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Search Filters</SheetTitle>
                    <SheetDescription>
                      Refine your search results
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            )}
            
            <Button onClick={handleSearch} disabled={isLoading} size="sm">
              {isLoading ? "..." : "Search"}
            </Button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
          <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
            <CardContent className="p-3">
              {recentSearches.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Recent searches</Label>
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-8 text-sm"
                      onClick={() => {
                        handleFilterChange('query', search);
                        setShowSuggestions(false);
                      }}
                    >
                      <Clock className="h-3 w-3 mr-2" />
                      {search}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="gap-1">
              {category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    categories: prev.categories.filter(c => c !== category)
                  }));
                }}
              />
            </Badge>
          ))}
          {activeFilterCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Desktop Filters Panel */}
      {showFilters && (
        <Card className="hidden lg:block">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            {resultCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {resultCount.toLocaleString()} results found
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Categories */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              categories: [...prev.categories, category]
                            }));
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              categories: prev.categories.filter(c => c !== category)
                            }));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Skill Level */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Skill Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  {levels.map((level) => (
                    <Button
                      key={level}
                      variant={filters.levels.includes(level) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (filters.levels.includes(level)) {
                          setFilters(prev => ({
                            ...prev,
                            levels: prev.levels.filter(l => l !== level)
                          }));
                        } else {
                          setFilters(prev => ({
                            ...prev,
                            levels: [...prev.levels, level]
                          }));
                        }
                      }}
                      className="justify-center"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value as [number, number])}
                  max={500}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={filters.isFree}
                    onCheckedChange={(checked) => handleFilterChange('isFree', checked)}
                  />
                  <Label className="text-sm">Free courses only</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}