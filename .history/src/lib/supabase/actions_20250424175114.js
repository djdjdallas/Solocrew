"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";

// Deal-related actions
export async function fetchFeaturedDeals() {
  try {
    const cookieStore = cookies();
    const supabase = createServerActionClient({ cookies: () => cookieStore });

    console.log("Fetching featured deals...");

    // First, let's check if we can access the deals table at all
    const { data: dealsCheck, error: dealsCheckError } = await supabase
      .from("deals")
      .select("id")
      .limit(1);

    if (dealsCheckError) {
      console.error("Error accessing deals table:", dealsCheckError);
      return [];
    }

    console.log("Deals table accessible, found records:", dealsCheck.length);

    // Now let's try the full query
    const { data, error } = await supabase
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
        providers:provider_id(id, company_name, logo_url),
        start_date,
        end_date,
        booking_deadline,
        min_travelers,
        max_travelers,
        tier_discounts,
        category,
        deal_pools(id, current_travelers)
      `
      )
      .eq("status", "active");

    if (error) {
      console.error("Error fetching featured deals:", error);

      // Let's try a simpler query without the relations to see if that works
      const { data: simpleData, error: simpleError } = await supabase
        .from("deals")
        .select("*")
        .eq("status", "active");

      if (simpleError) {
        console.error("Even simple query failed:", simpleError);
        return [];
      }

      console.log("Simple query worked, found deals:", simpleData.length);

      // Transform the simple data
      return simpleData.map((deal) => {
        return {
          id: deal.id,
          title: deal.title,
          description: deal.description,
          location: deal.location,
          thumbnailUrl: deal.thumbnail_url,
          originalPrice: deal.original_price,
          discountedPrice: deal.original_price, // Default without discount calculation
          providerName: "Provider", // Default without provider relation
          providerLogo: null,
          startDate: deal.start_date,
          endDate: deal.end_date,
          bookingDeadline: deal.booking_deadline,
          minTravelers: deal.min_travelers,
          currentTravelers: 0, // Default without deal_pools relation
          category: deal.category,
        };
      });
    }

    console.log(`Found ${data.length} deals with complete relations`);

    // Transform data
    return data.map((deal) => {
      // Parse tier_discounts (ensure it's valid JSON)
      let tierDiscounts = {};
      try {
        if (deal.tier_discounts) {
          tierDiscounts =
            typeof deal.tier_discounts === "string"
              ? JSON.parse(deal.tier_discounts)
              : deal.tier_discounts;
        }
      } catch (e) {
        console.error(`Error parsing tier_discounts for deal ${deal.id}:`, e);
      }

      // Calculate current travelers from deal_pools safely
      const currentTravelers =
        deal.deal_pools && Array.isArray(deal.deal_pools)
          ? deal.deal_pools.reduce(
              (total, pool) => total + (pool.current_travelers || 0),
              0
            )
          : 0;

      // Calculate discounted price based on the highest discount tier available
      let discountPercentage = 0;
      if (Object.keys(tierDiscounts).length > 0) {
        const highestDiscount = Object.entries(tierDiscounts)
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .find(([minUsers]) => Number(minUsers) <= currentTravelers);

        discountPercentage = highestDiscount ? Number(highestDiscount[1]) : 0;
      }

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
        category: deal.category,
      };
    });
  } catch (error) {
    console.error("Error in fetchFeaturedDeals:", error);
    return [];
  }
}
