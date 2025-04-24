import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Travel Solo, Save Together
        </h1>
        <p className="text-xl mb-8 text-muted-foreground">
          SolowCrew helps solo travelers join forces to unlock group discounts without sacrificing independence.
        </p>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/explore">
              Explore Deals
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/how-it-works">
              How It Works
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
