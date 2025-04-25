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
      return [];
    }

    console.log(`Found ${data.length} deals`);

    // Transform data
    return data.map((deal) => {
      const currentTravelers =
        deal.deal_pools?.reduce(
          (total, pool) => total + (pool.current_travelers || 0),
          0
        ) || 0;

      // Parse tier_discounts (ensure it's valid JSON)
      let tierDiscounts = {};
      try {
        tierDiscounts =
          typeof deal.tier_discounts === "string"
            ? JSON.parse(deal.tier_discounts)
            : deal.tier_discounts || {};
      } catch (e) {
        console.error(`Error parsing tier_discounts for deal ${deal.id}:`, e);
      }

      // Calculate discounted price based on the highest discount tier available
      const highestDiscount = Object.entries(tierDiscounts)
        .sort((a, b) => Number(b[0]) - Number(a[0]))
        .find(([minUsers]) => Number(minUsers) <= currentTravelers);

      const discountPercentage = highestDiscount
        ? Number(highestDiscount[1])
        : 0;
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
