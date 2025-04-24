import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { DealCard } from '@/components/deals/deal-card';
import { SearchFilters } from '@/components/deals/search-filters';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Featured destinations
const featuredDestinations = [
  {
    name: 'Bali',
    description: 'Tropical paradise with beaches and spiritual retreats',
    imageUrl: '/images/destinations/bali.jpg',
    slug: 'bali',
  },
  {
    name: 'Barcelona',
    description: 'Gaudi architecture and vibrant city culture',
    imageUrl: '/images/destinations/barcelona.jpg',
    slug: 'barcelona',
  },
  {
    name: 'Tokyo',
    description: 'Modern metropolis with historic temples',
    imageUrl: '/images/destinations/tokyo.jpg',
    slug: 'tokyo',
  },
  {
    name: 'New York',
    description: 'The city that never sleeps',
    imageUrl: '/images/destinations/new-york.jpg',
    slug: 'new-york',
  },
  {
    name: 'Paris',
    description: 'City of lights and romance',
    imageUrl: '/images/destinations/paris.jpg',
    slug: 'paris',
  },
  {
    name: 'Bangkok',
    description: 'Vibrant street life and ornate shrines',
    imageUrl: '/images/destinations/bangkok.jpg',
    slug: 'bangkok',
  },
];

// Categories for filter
const categories = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'city', label: 'City Breaks' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'beach', label: 'Beach' },
  { value: 'food', label: 'Food & Drink' },
];

export default async function ExplorePage({ searchParams }) {
  const supabase = createServerClient();
  
  // Parse search params
  const {
    location,
    priceMin,
    priceMax,
    startDate,
    endDate,
    category,
    sort = 'popular', // Default sort
  } = searchParams;
  
  // Build query
  let query = supabase
    .from('deals')
    .select(`
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
      category,
      deal_pools(id, current_travelers)
    `)
    .eq('status', 'active');
  
  // Apply filters
  if (location) {
    query = query.ilike('location', `%${location}%`);
  }
  
  if (priceMin) {
    query = query.gte('original_price', parseInt(priceMin, 10));
  }
  
  if (priceMax) {
    query = query.lte('original_price', parseInt(priceMax, 10));
  }
  
  if (startDate) {
    query = query.gte('start_date', startDate);
  }
  
  if (endDate) {
    query = query.lte('end_date', endDate);
  }
  
  if (category) {
    query = query.eq('category', category);
  }
  
  // Apply sorting
  switch (sort) {
    case 'price-low':
      query = query.order('original_price', { ascending: true });
      break;
    case 'price-high':
      query = query.order('original_price', { ascending: false });
      break;
    case 'date-soon':
      query = query.order('start_date', { ascending: true });
      break;
    case 'date-later':
      query = query.order('start_date', { ascending: false });
      break;
    case 'popular':
    default:
      // We'll sort by popularity after fetching data
      query = query.order('created_at', { ascending: false });
      break;
  }
  
  // Limit results for performance
  query = query.limit(24);
  
  // Execute query
  const { data: deals, error } = await query;
  
  if (error) {
    console.error('Error fetching deals:', error);
    return (
      <div className="text-center py-12">
        <h2 className="text-xl">Failed to load deals</h2>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }
  
  // Transform data
  const transformedDeals = deals.map(deal => {
    const currentTravelers = deal.deal_pools?.reduce(
      (total, pool) => total + (pool.current_travelers || 0), 0
    ) || 0;
    
    // Calculate discounted price based on the highest discount tier available
    const tierDiscounts = JSON.parse(deal.tier_discounts || '{}');
    const highestDiscount = Object.entries(tierDiscounts)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .find(([minUsers]) => Number(minUsers) <= currentTravelers);
    
    const discountPercentage = highestDiscount ? Number(highestDiscount[1]) : 0;
    const discountedPrice = Math.round(deal.original_price * (1 - discountPercentage / 100));
    
    return {
      id: deal.id,
      title: deal.title,
      description: deal.description,
      location: deal.location,
      thumbnailUrl: deal.thumbnail_url,
      originalPrice: deal.original_price,
      discountedPrice,
      providerName: deal.providers?.company_name || 'Provider',
      providerLogo: deal.providers?.logo_url,
      startDate: deal.start_date,
      endDate: deal.end_date,
      bookingDeadline: deal.booking_deadline,
      minTravelers: deal.min_travelers,
      currentTravelers,
    };
  });
  
  // If sort is by "popular", sort by the most joined (current_travelers)
  if (sort === 'popular') {
    transformedDeals.sort((a, b) => b.currentTravelers - a.currentTravelers);
  }
  
  // Check if we're filtering results (any search param is set)
  const isFiltering = Object.keys(searchParams).length > 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {!isFiltering && (
        <>
          {/* Hero Banner */}
          <div className="rounded-lg overflow-hidden relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10" />
            <Image
              src="/images/hero-explore.jpg"
              alt="Explore the world with SolowCrew"
              width={1200}
              height={400}
              className="w-full h-[400px] object-cover"
              priority
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">
                Find Your Next Adventure
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-center max-w-2xl">
                Join deal pools with other solo travelers and save up to 30%
              </p>
              <div className="w-full max-w-md relative">
                <form 
                  action="/explore"
                  method="get"
                  className="flex items-center"
                >
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      name="location"
                      placeholder="Where do you want to go?"
                      className="pl-10 py-6 pr-4 rounded-l-lg w-full border-0 focus-visible:ring-2"
                    />
                  </div>
                  <Button type="submit" size="lg" className="rounded-l-none">
                    Search
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Featured Destinations */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredDestinations.map((destination) => (
                <Link 
                  href={`/explore/${destination.slug}`} 
                  key={destination.slug}
                  className="group"
                >
                  <Card className="overflow-hidden h-full">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={destination.imageUrl}
                        alt={destination.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <h3 className="font-semibold text-lg">{destination.name}</h3>
                        <p className="text-xs text-white/80 line-clamp-1">
                          {destination.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters - Left Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters 
            searchParams={searchParams} 
            categories={categories} 
          />
        </div>
        
        {/* Deals - Main Content */}
        <div className="lg:col-span-3">
          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-muted-foreground mb-4 sm:mb-0">
              {isFiltering 
                ? `${transformedDeals.length} deals found`
                : 'Showing all available deals'}
            </p>
            
            <div className="flex items-center w-full sm:w-auto">
              <span className="text-sm mr-2">Sort by:</span>
              <Select
                defaultValue={sort}
                onValueChange={(value) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('sort', value);
                  window.location.href = url.toString();
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="date-soon">Date (Soonest)</SelectItem>
                  <SelectItem value="date-later">Date (Latest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Deal Grid */}
          {transformedDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {transformedDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted">
              <h3 className="text-xl font-medium mb-2">No deals found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or exploring other destinations
              </p>
              <Button asChild>
                <a href="/explore">View All Destinations</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
