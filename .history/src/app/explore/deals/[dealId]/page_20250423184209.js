// src/app/explore/deals/[dealId]/page.js
import { notFound } from "next/navigation";
import Image from "next/image";
import { createServerClient } from "@/lib/supabase/server";
import { DealGallery } from "@/components/deals/deal-gallery";
import { DealPool } from "@/components/deals/deal-pool";
import { ProviderInfo } from "@/components/deals/provider-info";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  ChevronLeft,
  Info,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JoinPoolButton } from "@/components/deals/join-pool-button";

export const dynamic = "force-dynamic";

export default async function DealDetailPage({ params }) {
  const { dealId } = params;
  const supabase = createServerClient();

  // Fetch deal details
  const { data: deal, error } = await supabase
    .from("deals")
    .select(
      `
      id, 
      title, 
      description, 
      location, 
      thumbnail_url,
      gallery_urls,
      original_price,
      provider_id,
      providers(id, company_name, logo_url, description, contact_email, website),
      start_date,
      end_date,
      booking_deadline,
      min_travelers,
      max_travelers,
      tier_discounts,
      category,
      deal_pools(
        id, 
        title, 
        description, 
        min_travelers, 
        current_travelers, 
        status, 
        expires_at,
        pool_members(
          id,
          user_id,
          status,
          users(id, first_name, last_name, avatar_url)
        )
      ),
      reviews(
        id,
        user_id,
        rating,
        title,
        content,
        created_at,
        users(id, first_name, last_name, avatar_url)
      )
    `
    )
    .eq("id", dealId)
    .single();

  if (error || !deal) {
    return notFound();
  }

  // Calculate the current total travelers
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

  // Calculate time left until booking deadline
  const timeLeft =
    new Date(deal.booking_deadline) > new Date()
      ? formatDistanceToNow(new Date(deal.booking_deadline), {
          addSuffix: true,
        })
      : "Expired";

  // Format discount tiers for display
  const formattedTiers = Object.entries(tierDiscounts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([travelers, discount]) => ({
      travelers: Number(travelers),
      discount: Number(discount),
    }));

  // Get active pools that haven't expired
  const activePools =
    deal.deal_pools?.filter(
      (pool) => pool.status === "open" && new Date(pool.expires_at) > new Date()
    ) || [];

  // Format pool members for display
  activePools.forEach((pool) => {
    pool.members =
      pool.pool_members?.map((member) => ({
        id: member.id,
        userId: member.user_id,
        status: member.status,
        user: {
          firstName: member.users?.first_name || "Anonymous",
          lastName: member.users?.last_name || "User",
          avatarUrl: member.users?.avatar_url,
        },
      })) || [];
  });

  // Calculate average rating from reviews
  const reviews = deal.reviews || [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="flex items-center" asChild>
          <a href="/explore">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Deals
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Deal Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Deal Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge>{deal.category}</Badge>
              {averageRating > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {averageRating.toFixed(1)} ({reviews.length})
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{deal.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{deal.location}</span>
            </div>
          </div>

          {/* Deal Gallery */}
          <DealGallery
            thumbnailUrl={deal.thumbnail_url}
            galleryUrls={deal.gallery_urls ? JSON.parse(deal.gallery_urls) : []}
          />

          {/* Deal Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-4">
              <div className="prose max-w-none">
                <p>{deal.description}</p>
              </div>
            </TabsContent>

            <TabsContent value="details" className="pt-4 space-y-4">
              {/* Details content */}
              {/* ... existing code ... */}
            </TabsContent>

            <TabsContent value="location" className="pt-4">
              {/* Location content */}
              {/* ... existing code ... */}
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              {/* Reviews content */}
              {/* ... existing code ... */}
            </TabsContent>
          </Tabs>

          {/* Provider Info */}
          <ProviderInfo provider={deal.providers} />
        </div>

        {/* Right Column - Booking Area */}
        <div className="lg:col-span-1 space-y-6">
          {/* Price Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="text-muted-foreground line-through">
                    ${deal.original_price}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    ${discountedPrice}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {discountPercentage}% off when minimum travelers join
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{currentTravelers} joined</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Ends {timeLeft}</span>
                  </div>
                </div>

                {activePools.length > 0 ? (
                  <JoinPoolButton
                    pool={{
                      id: activePools[0].id,
                      dealId: deal.id,
                      providerId: deal.provider_id,
                      dealTitle: deal.title,
                      location: deal.location,
                      discountedPrice,
                      minTravelers: activePools[0].min_travelers,
                      currentTravelers: activePools[0].current_travelers,
                      maxTravelers: deal.max_travelers,
                      expiresAt: activePools[0].expires_at,
                    }}
                  />
                ) : (
                  <Button className="w-full" disabled>
                    No active pools available
                  </Button>
                )}

                <div className="text-xs text-muted-foreground text-center">
                  <Info className="h-3 w-3 inline-block mr-1" />
                  No charge until minimum group size is reached
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Pools */}
          {activePools.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Active Deal Pools</h2>
              {activePools.map((pool) => (
                <DealPool
                  key={pool.id}
                  pool={{
                    id: pool.id,
                    title: pool.title,
                    description: pool.description,
                    minTravelers: pool.min_travelers,
                    currentTravelers: pool.current_travelers,
                    maxTravelers: deal.max_travelers,
                    expiresAt: pool.expires_at,
                    members: pool.members || [],
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
