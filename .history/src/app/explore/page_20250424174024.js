// src/app/explore/page.js
import { fetchFeaturedDeals } from "@/lib/supabase/actions";
import { DealCard } from "@/components/deals/deal-card";
import { DealExplorer } from "@/components/deals/deal-explorer";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  // Fetch all deals without filtering at the server level
  console.log("About to fetch deals...");
  const deals = await fetchFeaturedDeals();

  console.log("Deals fetched in page:", deals);
  console.log("Number of deals:", deals.length);

  return <DealExplorer initialDeals={deals} />;
}
