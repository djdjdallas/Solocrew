import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Browse Deals',
      description: 'Explore our curated selection of travel deals from trusted providers. Each listing shows the original price and potential discounts.',
      image: '/images/browse-deals.jpg'
    },
    {
      number: '02',
      title: 'Join a Deal Pool',
      description: 'Sign up for the deal you like with no upfront commitment. Watch as other solo travelers join the pool, unlocking bigger discounts.',
      image: '/images/join-pool.jpg'
    },
    {
      number: '03',
      title: 'Book When Ready',
      description: 'Once enough travelers join, you\'ll be notified that the discount is available. Only then do you pay, securing your discounted rate.',
      image: '/images/book-deal.jpg'
    },
    {
      number: '04',
      title: 'Travel Your Way',
      description: 'Enjoy your discounted travel experience on your own terms. You can choose to connect with other members or stay completely independent.',
      image: '/images/travel-solo.jpg'
    }
  ];

  return (
    <div className="bg-muted py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">
            How SolowCrew Works
          </h2>
          <p className="text-muted-foreground text-lg">
            We've simplified the process to help you get group rates while maintaining your independence.
          </p>
        </div>
        
        <div className="space-y-20">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center`}
            >
              {/* Content */}
              <div className="lg:w-1/2 space-y-4">
                <div className="inline-block text-xl font-bold bg-primary/10 text-primary px-3 py-1 rounded-md">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.description}</p>
              </div>
              
              {/* Image */}
              <div className="lg:w-1/2">
                <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video w-full">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <Button size="lg" asChild>
            <Link href="/explore">
              Browse Available Deals
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
