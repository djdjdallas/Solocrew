import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "How It Works | SolowCrew",
  description: "Learn how SolowCrew helps solo travelers save with group discounts",
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">How SolowCrew Works</h1>
        
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">The Problem We're Solving</h2>
            <p className="text-muted-foreground">
              Solo travelers often miss out on group discounts that are available to families or friend groups. 
              Travel providers offer these discounts because it's more efficient to serve groups, 
              but solo travelers end up paying premium prices just because they're traveling alone.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Solution: Deal Pools</h2>
            <p className="text-muted-foreground">
              SolowCrew creates "deal pools" that let solo travelers combine their buying power to unlock group discounts, 
              without actually having to travel together. Here's how it works:
            </p>
            
            <div className="space-y-8 mt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-medium">Browse Deals</h3>
                  <p className="text-muted-foreground mt-1">
                    Explore our curated selection of travel experiences from trusted providers.
                    Each deal shows the original price and potential discounts that can be unlocked with different group sizes.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-medium">Join a Deal Pool</h3>
                  <p className="text-muted-foreground mt-1">
                    When you find a deal you like, join its pool with no upfront commitment.
                    Watch as other solo travelers join the same pool, gradually unlocking bigger discounts as the group grows.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-medium">Book When Ready</h3>
                  <p className="text-muted-foreground mt-1">
                    Once the minimum group size is reached, you'll be notified that the deal is ready to book.
                    Only then do you make your payment, securing the discounted rate.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-medium">Travel Your Way</h3>
                  <p className="text-muted-foreground mt-1">
                    Enjoy your discounted travel experience on your own terms.
                    You can choose to connect with other pool members or travel completely independently.
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Benefits</h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li><strong>Save Money</strong> - Get access to group discounts that are normally unavailable to solo travelers</li>
              <li><strong>No Commitments</strong> - Join pools with no obligation; only pay when minimum group size is reached</li>
              <li><strong>Maintain Independence</strong> - Travel on your own terms while still benefiting from group rates</li>
              <li><strong>Optional Connections</strong> - Connect with other pool members only if you want to</li>
              <li><strong>Verified Providers</strong> - All travel providers on our platform are vetted for quality and reliability</li>
            </ul>
          </section>
          
          <div className="bg-muted rounded-lg p-6 border">
            <h3 className="text-xl font-medium mb-3">Ready to start saving?</h3>
            <p className="mb-4">Browse our current deals and join your first pool today.</p>
            <Button asChild>
              <Link href="/explore">Explore Deals</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
