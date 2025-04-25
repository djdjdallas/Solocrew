export default async function ExplorePage() {
  // Fetch all deals without filtering at the server level
  console.log("About to fetch deals...");
  const deals = await fetchFeaturedDeals();

  console.log("Deals fetched in page:", deals);
  console.log("Number of deals:", deals.length);

  return <DealExplorer initialDeals={deals} />;
}
