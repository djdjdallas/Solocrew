// src/app/explore/page.js
import Link from "next/link";
import { fetchFeaturedDeals } from "@/lib/supabase/actions";
import { DealCard } from "@/components/deals/deal-card";
import { SearchFilters } from "@/components/deals/search-filters";
import { Select } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const dynamic = "force-dynamic";

const categoryOptions = [
  { value: "wellness", label: "Wellness & Spa" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "city", label: "City Break" },
  { value: "food", label: "Food & Culinary" },
  { value: "beach", label: "Beach" },
];

// Default values for filtered parameters
const defaultFilteredParams = {
  sort: "recommended",
  location: "",
  category: "",
  priceMin: 0,
  priceMax: 5000,
  startDate: null,
  endDate: null,
};

export default async function ExplorePage(props) {
  // Fetch deals early
  const deals = await fetchFeaturedDeals();

  // Create a shallow copy of default params
  const filteredParams = { ...defaultFilteredParams };

  // Only try to extract values if params exist and do it with a safe approach
  if (props.searchParams) {
    // Safely extract primitive values without complex operations
    const params = props.searchParams;

    // Build filtered params without directly accessing properties
    filteredParams.sort = params.sort || defaultFilteredParams.sort;
    filteredParams.location = params.location || defaultFilteredParams.location;
    filteredParams.category = params.category || defaultFilteredParams.category;

    // Handle numeric conversions separately
    if (params.priceMin) {
      try {
        filteredParams.priceMin = parseInt(params.priceMin, 10);
      } catch (e) {
        // Use default on parse error
      }
    }

    if (params.priceMax) {
      try {
        filteredParams.priceMax = parseInt(params.priceMax, 10);
      } catch (e) {
        // Use default on parse error
      }
    }

    // Pass through date strings
    filteredParams.startDate =
      params.startDate || defaultFilteredParams.startDate;
    filteredParams.endDate = params.endDate || defaultFilteredParams.endDate;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Travel Deals</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Search Filters */}
        <div className="lg:col-span-1">
          <SearchFilters
            searchParams={filteredParams}
            categories={categoryOptions}
          />
        </div>

        {/* Right Content - Deal Results */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing {deals.length} results
            </p>

            <Select defaultValue={filteredParams.sort}>
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

          {deals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
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
