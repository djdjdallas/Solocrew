// src/app/explore/page.js
import { fetchFeaturedDeals } from "@/lib/supabase/actions";
import { DealCard } from "@/components/deals/deal-card";
import { DealExplorer } from "@/components/deals/deal-explorer";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  // Fetch all deals without filtering at the server level
  const deals = await fetchFeaturedDeals();

  return <DealExplorer initialDeals={deals} />;
}
