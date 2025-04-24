// src/app/explore/locations/[location]/page.js
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { DealCard } from "@/components/deals/deal-card";
import { SearchFilters } from "@/components/deals/search-filters";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

const categoryOptions = [
  { value: "wellness", label: "Wellness & Spa" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "city", label: "City Break" },
  { value: "food", label: "Food & Culinary" },
  { value: "beach", label: "Beach" },
];

// Location background images
const locationImages = {
  bali: "/images/locations/bali-header.jpg",
  barcelona: "/images/locations/barcelona-header.jpg",
  tokyo: "/images/locations/tokyo-header.jpg",
  // Add more locations as needed
};

export default async function LocationPage({ params, searchParams }) {
  const { location } = params;
  const decodedLocation = decodeURIComponent(location);
  const supabase = createServerClient();

  // Fetch deals for this location
  let query = supabase
    .from("deals")
    .select(
      `
      id, 
      title, 
      description, 
      location, 
      thumbnail_url,
      original_price,
      provider_id,
      providers(id, company_name, logo_url),
      start_date,
      end_date,
      booking_deadline,
      min_travelers,
      max_travelers,
      tier_discounts,
      deal_pools(id, current_travelers)
    `
    )
    .eq("status", "active")
    .ilike("location", `%${decodedLocation}%`)
    .order("created_at", { ascending: false });

  // Apply price filters if provided
  if (searchParams.priceMin) {
    query = query.gte("original_price", searchParams.priceMin);
  }

  if (searchParams.priceMax) {
    query = query.lte("original_price", searchParams.priceMax);
  }

  // Apply date filters if provided
  if (searchParams.startDate) {
    query = query.gte("start_date", searchParams.startDate);
  }

  if (searchParams.endDate) {
    query = query.lte("end_date", searchParams.endDate);
  }

  // Apply category filter if provided
  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  const { data: deals, error } = await query;

  if (error) {
    console.error("Error fetching deals:", error);
    return notFound();
  }

  // Transform data
  const formattedDeals = deals.map((deal) => {
    const currentTravelers =
      deal.deal_pools?.reduce(
        (total, pool) => total + (pool.current_travelers || 0),
        0
      ) || 0;

    // Calculate discounted price based on the highest discount tier available
    const tierDiscounts = JSON.parse(deal.tier_discounts || "{}");
    const highestDiscount = Object.entries(tierDiscounts)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .find(([minUsers]) => Number(minUsers) <= currentTravelers);

    const discountPercentage = highestDiscount ? Number(highestDiscount[1]) : 0;
    const discountedPrice = Math.round(
      deal.original_price * (1 - discountPercentage / 100)
    );

    return {
      id: deal.id,
      title: deal.title,
      description: deal.description,
      location: deal.location,
      thumbnailUrl: deal.thumbnail_url,
      originalPrice: deal.original_price,
      discountedPrice,
      providerName: deal.providers?.company_name || "Provider",
      providerLogo: deal.providers?.logo_url,
      startDate: deal.start_date,
      endDate: deal.end_date,
      bookingDeadline: deal.booking_deadline,
      minTravelers: deal.min_travelers,
      currentTravelers,
    };
  });

  // Format location name for display
  const formattedLocationName = decodedLocation
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return (
    <div>
      {/* Location Header */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
            locationImages[location.toLowerCase()] ||
            "/images/locations/default-header.jpg"
          })`,
        }}
      >
        <div className="container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
          <div className="flex items-center text-white mb-2">
            <MapPin className="h-5 w-5 mr-2" />
            <span className="text-lg font-medium">Destinations</span>
          </div>
          <h1 className="text-4xl font-bold text-white">
            {formattedLocationName}
          </h1>
          <p className="text-white mt-2 max-w-2xl">
            Explore our curated deals for {formattedLocationName} and find the
            perfect adventure for your solo travel!
          </p>
        </div>
      </div>

      {/* Deals Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Search Filters */}
          <div className="lg:col-span-1">
            <SearchFilters
              searchParams={searchParams}
              categories={categoryOptions}
            />
          </div>

          {/* Right Content - Deal Results */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {formattedDeals.length} results for{" "}
                {formattedLocationName}
              </p>
            </div>

            {formattedDeals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formattedDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-xl font-medium mb-2">
                  No deals found for {formattedLocationName}
                </p>
                <p className="text-muted-foreground">
                  Try adjusting your search filters or explore other
                  destinations
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
