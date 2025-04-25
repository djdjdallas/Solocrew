"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
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
import { useToast } from "@/components/ui/use-toast";

export default function DealDetailPage() {
  const { dealId } = useParams();
  const [deal, setDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClient();
  const { toast } = useToast();

  // State for derived data
  const [currentTravelers, setCurrentTravelers] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [formattedTiers, setFormattedTiers] = useState([]);
  const [activePools, setActivePools] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchDealDetails() {
      setIsLoading(true);
      try {
        // Fetch deal details
        const { data, error } = await supabase
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
            providers:provider_id(id, company_name, logo_url, description, contact_email, website),
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

        if (error) throw error;
        if (!data) throw new Error("Deal not found");

        setDeal(data);
        processData(data);
      } catch (err) {
        console.error("Error fetching deal:", err);
        setError(err);
        toast({
          variant: "destructive",
          title: "Error loading deal",
          description: "There was a problem loading this deal.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDealDetails();
  }, [dealId, supabase, toast]);

  // Process and calculate derived data from the deal
  function processData(deal) {
    // Calculate the current total travelers
    const travelers =
      deal.deal_pools?.reduce(
        (total, pool) => total + (pool.current_travelers || 0),
        0
      ) || 0;
    setCurrentTravelers(travelers);

    // Calculate discounted price based on the highest discount tier available
    try {
      const tierDiscounts = JSON.parse(deal.tier_discounts || "{}");
      const highestDiscount = Object.entries(tierDiscounts)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .find(([minUsers]) => Number(minUsers) <= travelers);

      const discPercentage = highestDiscount ? Number(highestDiscount[1]) : 0;
      setDiscountPercentage(discPercentage);
      setDiscountedPrice(
        Math.round(deal.original_price * (1 - discPercentage / 100))
      );

      // Format discount tiers for display
      const tiers = Object.entries(tierDiscounts)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([travelers, discount]) => ({
          travelers: Number(travelers),
          discount: Number(discount),
        }));
      setFormattedTiers(tiers);
    } catch (e) {
      console.error("Error parsing tier discounts", e);
    }

    // Calculate time left until booking deadline
    setTimeLeft(
      new Date(deal.booking_deadline) > new Date()
        ? formatDistanceToNow(new Date(deal.booking_deadline), {
            addSuffix: true,
          })
        : "Expired"
    );

    // Get active pools that haven't expired
    const pools =
      deal.deal_pools?.filter(
        (pool) =>
          pool.status === "open" && new Date(pool.expires_at) > new Date()
      ) || [];

    // Format pool members for display
    pools.forEach((pool) => {
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
    setActivePools(pools);

    // Calculate average rating from reviews
    const dealReviews = deal.reviews || [];
    setReviews(dealReviews);
    setAverageRating(
      dealReviews.length > 0
        ? dealReviews.reduce((sum, review) => sum + review.rating, 0) /
            dealReviews.length
        : 0
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="flex items-center" asChild>
          <Link href="/explore">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Deals
          </Link>
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
              <div>
                <h3 className="text-lg font-semibold mb-2">Dates</h3>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(deal.start_date).toLocaleDateString()} -{" "}
                    {new Date(deal.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Group Size</h3>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Minimum: {deal.min_travelers} travelers</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Discount Tiers</h3>
                <div className="space-y-2">
                  {formattedTiers.map((tier, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                          currentTravelers >= tier.travelers
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {tier.travelers}
                      </div>
                      <span
                        className={
                          currentTravelers >= tier.travelers
                            ? "font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {tier.travelers} travelers: {tier.discount}% discount
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Booking Deadline</h3>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(deal.booking_deadline).toLocaleDateString()} (
                    {timeLeft})
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="pt-4">
              <div className="aspect-video rounded-md overflow-hidden bg-muted">
                {/* Replace with actual map implementation */}
                <div className="flex items-center justify-center h-full bg-muted">
                  <MapPin className="h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="ml-2 text-muted-foreground">
                    Map for {deal.location}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-4">
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={review.users?.avatar_url}
                              alt={`${review.users?.first_name} ${review.users?.last_name}`}
                            />
                            <AvatarFallback>
                              {review.users?.first_name?.[0]}
                              {review.users?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {review.users?.first_name}{" "}
                                  {review.users?.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(
                                    review.created_at
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? "fill-primary text-primary"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="mt-2">
                              {review.title && (
                                <p className="font-medium">{review.title}</p>
                              )}
                              <p className="text-muted-foreground">
                                {review.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No reviews yet for this experience.</p>
                </div>
              )}
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

          {/* Deal Features */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">What's Included</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 text-primary flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Group discount rates</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 text-primary flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>No commitment until minimum group size reached</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 text-primary flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Optional connection with other travelers</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 text-primary flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Secure payment processing</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
