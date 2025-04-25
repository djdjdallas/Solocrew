"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { DealCard } from "@/components/deals/deal-card";
import { SearchFilters } from "@/components/deals/search-filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categoryOptions = [
  { value: "wellness", label: "Wellness & Spa" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "city", label: "City Break" },
  { value: "food", label: "Food & Culinary" },
  { value: "beach", label: "Beach" },
];

export function DealExplorer({ initialDeals }) {
  const [deals, setDeals] = useState(initialDeals);
  const [filteredDeals, setFilteredDeals] = useState(initialDeals);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Create safe search params object for client-side filtering
  const getFilterParams = () => {
    return {
      sort: searchParams.get("sort") || "recommended",
      location: searchParams.get("location") || "",
      category: searchParams.get("category") || "",
      priceMin: searchParams.get("priceMin")
        ? parseInt(searchParams.get("priceMin"), 10)
        : 0,
      priceMax: searchParams.get("priceMax")
        ? parseInt(searchParams.get("priceMax"), 10)
        : 5000,
      startDate: searchParams.get("startDate") || null,
      endDate: searchParams.get("endDate") || null,
    };
  };

  // Apply client-side filtering based on search params
  useEffect(() => {
    const params = getFilterParams();

    let filtered = [...initialDeals];

    // Apply location filter
    if (params.location) {
      filtered = filtered.filter((deal) =>
        deal.location.toLowerCase().includes(params.location.toLowerCase())
      );
    }

    // Apply category filter
    if (params.category) {
      filtered = filtered.filter((deal) => deal.category === params.category);
    }

    // Apply price filter
    filtered = filtered.filter(
      (deal) =>
        deal.discountedPrice >= params.priceMin &&
        deal.discountedPrice <= params.priceMax
    );

    // Apply date filters if present
    if (params.startDate) {
      const startDate = new Date(params.startDate);
      filtered = filtered.filter(
        (deal) => new Date(deal.startDate) >= startDate
      );
    }

    if (params.endDate) {
      const endDate = new Date(params.endDate);
      filtered = filtered.filter((deal) => new Date(deal.endDate) <= endDate);
    }

    // Apply sorting
    switch (params.sort) {
      case "price-low":
        filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "price-high":
        filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "date-soon":
        filtered.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        break;
      case "travelers-most":
        filtered.sort((a, b) => b.currentTravelers - a.currentTravelers);
        break;
      // 'recommended' is the default sort, no need to sort
    }

    setFilteredDeals(filtered);
  }, [searchParams, initialDeals]);

  // Handle sort change
  const handleSortChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Travel Deals</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Search Filters */}
        <div className="lg:col-span-1">
          <SearchFilters
            searchParams={getFilterParams()}
            categories={categoryOptions}
          />
        </div>

        {/* Right Content - Deal Results */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing {filteredDeals.length} results
            </p>

            <Select
              defaultValue={getFilterParams().sort}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="date-soon">Date: Soonest First</SelectItem>
                <SelectItem value="travelers-most">Most Travelers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-xl font-medium mb-2">No deals found</p>
              <p className="text-muted-foreground">
                Try adjusting your search filters to find more options
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
