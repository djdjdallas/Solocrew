"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";

// Deal-related actions
export async function fetchFeaturedDeals() {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  try {
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
        deal_pools(id, current_travelers)
      `
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) {
      console.error("Error fetching featured deals:", error);
      return [];
    }

    // Transform data
    return data.map((deal) => {
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
      };
    });
  } catch (error) {
    console.error("Error in fetchFeaturedDeals:", error);
    return [];
  }
}

export async function joinDealPool(poolId, userId) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  try {
    // First check if user is already in the pool
    const { data: existingMember, error: checkError } = await supabase
      .from("pool_members")
      .select("id")
      .eq("pool_id", poolId)
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingMember) {
      return { success: false, message: "Already joined this pool" };
    }

    // Join the pool
    const { error: joinError } = await supabase.from("pool_members").insert({
      pool_id: poolId,
      user_id: userId,
      status: "pending",
    });

    if (joinError) throw joinError;

    // Update the pool's current_travelers count
    const { data: poolData, error: poolError } = await supabase
      .from("deal_pools")
      .select("current_travelers, deal_id")
      .eq("id", poolId)
      .single();

    if (poolError) throw poolError;

    await supabase
      .from("deal_pools")
      .update({
        current_travelers: (poolData.current_travelers || 0) + 1,
      })
      .eq("id", poolId);

    // Revalidate the deal page
    if (poolData.deal_id) {
      revalidatePath(`/explore/${poolData.deal_id}`);
    }

    return {
      success: true,
      message: "Successfully joined pool",
    };
  } catch (error) {
    console.error("Error joining pool:", error);
    return {
      success: false,
      message: error.message || "Failed to join pool",
    };
  }
}

// User-related actions
export async function getUserProfile(userId) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

export async function updateUserProfile(userId, profileData) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("users")
    .update(profileData)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/profile");
  return { success: true, data };
}

// Booking-related actions
export async function getUserBookings(userId) {
  const cookieStore = cookies();
  const supabase = createServerActionClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id,
      status,
      amount_paid,
      created_at,
      booking_details,
      deals(
        id,
        title,
        thumbnail_url,
        location,
        start_date,
        end_date,
        providers:provider_id(company_name, logo_url)
      )
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user bookings:", error);
    return [];
  }

  return data;
}
