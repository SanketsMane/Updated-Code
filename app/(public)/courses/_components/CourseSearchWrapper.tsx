"use client";

import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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

interface CourseSearchWrapperProps {
  placeholder?: string;
  categories?: string[];
  levels?: string[];
  durations?: string[];
}

export function CourseSearchWrapper({ 
  placeholder = "Search courses, instructors, topics...",
  categories = [],
  levels = [],
  durations = []
}: CourseSearchWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchMetadata, setSearchMetadata] = useState({
    categories,
    levels,
    durations
  });

  // Fetch metadata if not provided
  useEffect(() => {
    if (categories.length === 0 || levels.length === 0 || durations.length === 0) {
      fetchSearchMetadata();
    }
  }, [categories.length, levels.length, durations.length]);

  const fetchSearchMetadata = async () => {
    try {
      const response = await fetch('/api/courses/metadata');
      if (response.ok) {
        const metadata = await response.json();
        setSearchMetadata({
          categories: metadata.categories || [],
          levels: metadata.levels || [],
          durations: metadata.durations || []
        });
      }
    } catch (error) {
      console.error('Error fetching search metadata:', error);
      // Fallback to default values
      setSearchMetadata({
        categories: ["Web Development", "Data Science", "Design", "Business", "Marketing"],
        levels: ["Beginner", "Intermediate", "Advanced"],
        durations: ["0-2 hours", "2-6 hours", "6+ hours"]
      });
    }
  };

  const handleSearch = useCallback((filters: SearchFilters) => {
    const params = new URLSearchParams();
    
    // Add search query if provided
    if (filters.query.trim()) {
      params.set('search', filters.query.trim());
    }
    
    // Add category filter if provided (taking first category for simplicity)
    if (filters.categories.length > 0) {
      params.set('category', filters.categories[0]);
    }
    
    // Add level filter if provided (taking first level for simplicity)
    if (filters.levels.length > 0) {
      params.set('level', filters.levels[0]);
    }

    // Add other filters as needed
    if (filters.isFree) {
      params.set('free', 'true');
    }

    // Navigate to the same page with updated search params
    const paramString = params.toString();
    const newUrl = paramString ? `?${paramString}` : '';
    router.push(newUrl);
  }, [router]);

  const handleFilterChange = useCallback((filters: SearchFilters) => {
    // Optional: Handle real-time filter changes if needed
    // For now, we'll just use the onSearch callback
  }, []);

  return (
    <AdvancedSearch
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      placeholder={placeholder}
      categories={searchMetadata.categories}
      levels={searchMetadata.levels}
      durations={searchMetadata.durations}
    />
  );
}