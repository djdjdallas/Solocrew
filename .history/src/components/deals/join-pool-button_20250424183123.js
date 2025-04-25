"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";

export function JoinPoolButton({
  pool,
  variant = "default",
  size = "default",
}) {
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();

  const handleJoinPool = async () => {
    if (!user) {
      router.push(`/login?redirect=/explore/${pool.dealId}`);
      return;
    }

    try {
      setIsJoining(true);

      // Check if user already joined
      const { data: existingMember } = await supabase
        .from("pool_members")
        .select("id")
        .eq("pool_id", pool.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingMember) {
        toast({
          title: "You've already joined this pool",
          description: "You'll be notified when the pool is complete.",
        });
        return;
      }

      // Join the pool
      const { error } = await supabase.from("pool_members").insert({
        pool_id: pool.id,
        user_id: user.id,
        status: "pending",
      });

      if (error) throw error;

      // Update the pool member count
      const { data: poolData } = await supabase
        .from("deal_pools")
        .select("current_travelers")
        .eq("id", pool.id)
        .single();

      await supabase
        .from("deal_pools")
        .update({
          current_travelers: (poolData.current_travelers || 0) + 1,
        })
        .eq("id", pool.id);

      toast({
        title: "You've joined the pool!",
        description:
          "You'll be notified when the minimum number of travelers is reached.",
      });

      // Refresh the page to show updated state
      router.refresh();
    } catch (error) {
      console.error("Error joining pool:", error);
      toast({
        variant: "destructive",
        title: "Failed to join pool",
        description: "There was a problem joining this pool. Please try again.",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!user) {
      router.push(`/login?redirect=/explore/${pool.dealId}`);
      return;
    }

    setIsLoading(true);

    try {
      // Create checkout session with Stripe
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          poolId: pool.id,
          dealId: pool.dealId,
          providerId: pool.providerId,
          amount: pool.discountedPrice,
          title: pool.dealTitle || "Travel booking",
          description: `Booking for ${pool.location}`,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) throw new Error(error);

      // Redirect to Stripe checkout
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description:
          "There was a problem processing your payment. Please try again.",
      });
      setIsLoading(false);
    }
  };

  // Check if pool is already at capacity
  const isPoolFull = pool.currentTravelers >= pool.maxTravelers;

  // Check if pool is expired
  const isExpired = new Date(pool.expiresAt) < new Date();

  // Check if pool has reached minimum size and is ready for checkout
  const isReadyForCheckout = pool.currentTravelers >= pool.minTravelers;

  // Determine button text and action
  let buttonText = "Join Pool";
  let buttonAction = handleJoinPool;
  let isDisabled = false;

  if (isJoining || isLoading) {
    buttonText = isJoining ? "Joining..." : "Processing...";
    isDisabled = true;
  } else if (isPoolFull) {
    buttonText = "Pool Full";
    isDisabled = true;
  } else if (isExpired) {
    buttonText = "Pool Expired";
    isDisabled = true;
  } else if (isReadyForCheckout) {
    buttonText = "Proceed to Payment";
    buttonAction = handleProceedToCheckout;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className="w-full"
      onClick={buttonAction}
      disabled={isDisabled}
    >
      {buttonText}
    </Button>
  );
}
