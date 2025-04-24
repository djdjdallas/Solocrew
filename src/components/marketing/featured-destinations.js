import Link from 'next/link';
import Image from 'next/image';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

export function FeaturedDestinations() {
  // Categories of destinations
  const categories = [
    { id: 'popular', name: 'Popular' },
    { id: 'beach', name: 'Beach' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'city', name: 'City' },
    { id: 'wellness', name: 'Wellness' },
  ];
  
  // Destinations by category
  const destinations = {
    popular: [
      { name: 'Bali', description: 'Indonesia', image: '/images/destinations/bali.jpg', slug: 'bali' },
      { name: 'Barcelona', description: 'Spain', image: '/images/destinations/barcelona.jpg', slug: 'barcelona' },
      { name: 'Tokyo', description: 'Japan', image: '/images/destinations/tokyo.jpg', slug: 'tokyo' },
      { name: 'New York', description: 'USA', image: '/images/destinations/new-york.jpg', slug: 'new-york' },
      { name: 'Paris', description: 'France', image: '/images/destinations/paris.jpg', slug: 'paris' },
      { name: 'Bangkok', description: 'Thailand', image: '/images/destinations/bangkok.jpg', slug: 'bangkok' },
    ],
    beach: [
      { name: 'Maldives', description: 'Tropical Paradise', image: '/images/destinations/maldives.jpg', slug: 'maldives' },
      { name: 'Cancun', description: 'Mexico', image: '/images/destinations/cancun.jpg', slug: 'cancun' },
      { name: 'Santorini', description: 'Greece', image: '/images/destinations/santorini.jpg', slug: 'santorini' },
      { name: 'Bora Bora', description: 'French Polynesia', image: '/images/destinations/bora-bora.jpg', slug: 'bora-bora' },
      { name: 'Phuket', description: 'Thailand', image: '/images/destinations/phuket.jpg', slug: 'phuket' },
      { name: 'Hawaii', description: 'USA', image: '/images/destinations/hawaii.jpg', slug: 'hawaii' },
    ],
    adventure: [
      { name: 'Patagonia', description: 'Argentina & Chile', image: '/images/destinations/patagonia.jpg', slug: 'patagonia' },
      { name: 'Costa Rica', description: 'Central America', image: '/images/destinations/costa-rica.jpg', slug: 'costa-rica' },
      { name: 'New Zealand', description: 'Oceania', image: '/images/destinations/new-zealand.jpg', slug: 'new-zealand' },
      { name: 'Nepal', description: 'Himalayas', image: '/images/destinations/nepal.jpg', slug: 'nepal' },
      { name: 'Iceland', description: 'Nordic', image: '/images/destinations/iceland.jpg', slug: 'iceland' },
      { name: 'Safari', description: 'Tanzania', image: '/images/destinations/safari.jpg', slug: 'safari' },
    ],
    city: [
      { name: 'London', description: 'United Kingdom', image: '/images/destinations/london.jpg', slug: 'london' },
      { name: 'Rome', description: 'Italy', image: '/images/destinations/rome.jpg', slug: 'rome' },
      { name: 'Singapore', description: 'Asia', image: '/images/destinations/singapore.jpg', slug: 'singapore' },
      { name: 'Dubai', description: 'UAE', image: '/images/destinations/dubai.jpg', slug: 'dubai' },
      { name: 'Sydney', description: 'Australia', image: '/images/destinations/sydney.jpg', slug: 'sydney' },
      { name: 'San Francisco', description: 'USA', image: '/images/destinations/san-francisco.jpg', slug: 'san-francisco' },
    ],
    wellness: [
      { name: 'Tulum', description: 'Mexico', image: '/images/destinations/tulum.jpg', slug: 'tulum' },
      { name: 'Ubud', description: 'Bali, Indonesia', image: '/images/destinations/ubud.jpg', slug: 'ubud' },
      { name: 'Sedona', description: 'USA', image: '/images/destinations/sedona.jpg', slug: 'sedona' },
      { name: 'Kerala', description: 'India', image: '/images/destinations/kerala.jpg', slug: 'kerala' },
      { name: 'Swiss Alps', description: 'Switzerland', image: '/images/destinations/swiss-alps.jpg', slug: 'swiss-alps' },
      { name: 'Kyoto', description: 'Japan', image: '/images/destinations/kyoto.jpg', slug: 'kyoto' },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Explore Popular Destinations
        </h2>
        <p className="text-muted-foreground text-lg">
          Discover amazing solo travel experiences with group discounts in these trending locations.
        </p>
      </div>
      
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="mb-8 flex justify-center h-auto bg-transparent p-0 w-auto mx-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {destinations[category.id].map((destination) => (
                <Link 
                  key={destination.slug} 
                  href={`/explore/${destination.slug}`}
                  className="group"
                >
                  <Card className="overflow-hidden h-full">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-xl">{destination.name}</h3>
                        <p className="text-sm text-white/80">
                          {destination.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
