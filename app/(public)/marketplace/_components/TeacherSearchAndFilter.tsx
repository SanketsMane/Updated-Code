"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardHeader 
} from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  MessageCircle, 
  Globe,
  CheckCircle,
  X
} from "lucide-react";
import { Teacher } from "@/app/data/teachers/get-public-teachers";
import Link from "next/link";

interface TeacherSearchAndFilterProps {
  teachers: Teacher[];
}

function SessionBookingButton({ instructorId }: { instructorId: string }) {
  return (
    <Link href={`/live-sessions?teacher=${instructorId}`}>
      <button className="w-full px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
        Book Session
      </button>
    </Link>
  );
}

export function TeacherSearchAndFilter({ teachers }: TeacherSearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [minRating, setMinRating] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique expertise areas and languages for filters
  const allExpertise = useMemo(() => {
    const expertiseSet = new Set<string>();
    teachers.forEach(teacher => {
      teacher.specialties.forEach(specialty => expertiseSet.add(specialty));
    });
    return Array.from(expertiseSet).sort();
  }, [teachers]);

  const allLanguages = useMemo(() => {
    const languageSet = new Set<string>();
    teachers.forEach(teacher => {
      teacher.languages.forEach(language => languageSet.add(language));
    });
    return Array.from(languageSet).sort();
  }, [teachers]);

  // Filter teachers based on search and filters
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      // Search query filter
      const matchesSearch = searchQuery === "" || 
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        teacher.bio?.toLowerCase().includes(searchQuery.toLowerCase());

      // Expertise filter
      const matchesExpertise = selectedExpertise === "all" || 
        teacher.specialties.includes(selectedExpertise);

      // Language filter
      const matchesLanguage = selectedLanguage === "all" || 
        teacher.languages.includes(selectedLanguage);

      // Price range filter
      const matchesPriceRange = (() => {
        if (priceRange === "all") return true;
        const rate = teacher.hourlyRate;
        switch (priceRange) {
          case "under-50": return rate < 50;
          case "50-75": return rate >= 50 && rate <= 75;
          case "75-100": return rate >= 75 && rate <= 100;
          case "over-100": return rate > 100;
          default: return true;
        }
      })();

      // Rating filter
      const matchesRating = minRating === "all" || teacher.rating >= parseFloat(minRating);

      return matchesSearch && matchesExpertise && matchesLanguage && matchesPriceRange && matchesRating;
    });
  }, [teachers, searchQuery, selectedExpertise, selectedLanguage, priceRange, minRating]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedExpertise("all");
    setSelectedLanguage("all");
    setPriceRange("all");
    setMinRating("all");
  };

  const activeFiltersCount = [selectedExpertise, selectedLanguage, priceRange, minRating]
    .filter(filter => filter !== "all").length + (searchQuery ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search your favorite teacher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-3 text-base border-2 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Filter Toggle Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Featured Instructors</h2>
          <Badge variant="outline">{filteredTeachers.length} instructors available</Badge>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-muted/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Expertise Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Expertise</label>
                <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                  <SelectTrigger>
                    <SelectValue placeholder="All expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All expertise</SelectItem>
                    {allExpertise.map(expertise => (
                      <SelectItem key={expertise} value={expertise}>
                        {expertise}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="All languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    {allLanguages.map(language => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Hourly Rate</label>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All prices</SelectItem>
                    <SelectItem value="under-50">Under $50/hr</SelectItem>
                    <SelectItem value="50-75">$50-75/hr</SelectItem>
                    <SelectItem value="75-100">$75-100/hr</SelectItem>
                    <SelectItem value="over-100">Over $100/hr</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Rating</label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any rating</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                    <SelectItem value="3.0">3.0+ stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters Button */}
            {activeFiltersCount > 0 && (
              <Button 
                variant="ghost" 
                onClick={clearAllFilters}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Clear all filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No instructors found matching your criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((instructor) => (
            <InstructorCard key={instructor.id} instructor={instructor} />
          ))}
        </div>
      )}
    </div>
  );
}

function InstructorCard({ instructor }: { instructor: Teacher }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden border-0 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto mb-4">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
          />
          {instructor.verified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
        </div>
        
        <h3 className="font-bold text-lg">{instructor.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2">{instructor.title}</p>
        
        <div className="flex items-center justify-center space-x-4 mt-3 text-sm">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{instructor.rating}</span>
            <span className="text-muted-foreground">({instructor.reviews})</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{instructor.students}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Languages */}
        <div className="flex flex-wrap gap-1">
          {instructor.languages.slice(0, 2).map((language, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              <Globe className="w-3 h-3 mr-1" />
              {language}
            </Badge>
          ))}
          {instructor.languages.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{instructor.languages.length - 2} more
            </Badge>
          )}
        </div>
        
        {/* Specialties */}
        <div className="flex flex-wrap gap-1">
          {instructor.specialties.slice(0, 3).map((specialty, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {instructor.specialties.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{instructor.specialties.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Pricing and Response Time */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hourly rate:</span>
            <span className="font-semibold">${instructor.hourlyRate}/hr</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">{instructor.responseTime}</span>
          </div>
        </div>
        
        <div className="pt-4">
          <SessionBookingButton instructorId={instructor.id} />
        </div>
      </CardContent>
    </Card>
  );
}