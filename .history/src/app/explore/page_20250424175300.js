// src/app/explore/page.js
import { fetchFeaturedDeals } from "@/lib/supabase/actions";
import { DealExplorer } from "@/components/deals/deal-explorer";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  try {
    console.log("About to fetch deals...");
    const deals = await fetchFeaturedDeals();

    console.log(
      "Deals fetched in page:",
      deals ? "Success" : "No data returned"
    );
    console.log("Number of deals:", deals?.length || 0);

    return <DealExplorer initialDeals={deals || []} />;
  } catch (error) {
    console.error("Error in ExplorePage:", error);
    // Return DealExplorer with empty array if there's an error
    return <DealExplorer initialDeals={[]} />;
  }
}
