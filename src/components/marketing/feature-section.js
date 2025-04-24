import { 
  CreditCard, 
  Users, 
  Compass, 
  Shield, 
  Clock, 
  Zap 
} from 'lucide-react';

export function FeatureSection() {
  const features = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Save Up to 30%',
      description: 'Unlock group discounts that are typically unavailable to solo travelers.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Stay Independent',
      description: 'Benefit from group rates without having to travel with others.'
    },
    {
      icon: <Compass className="h-6 w-6" />,
      title: 'Curated Experiences',
      description: 'Access hand-picked destinations and experiences from trusted providers.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'No Risk Booking',
      description: 'Only pay when the minimum group size is reached. No charges otherwise.'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Flexible Planning',
      description: 'Join pools with flexible dates to find the perfect time for your adventure.'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Optional Connections',
      description: 'Connect with other travelers only if you want to. No obligation.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-4">
          The Smarter Way to Travel Solo
        </h2>
        <p className="text-muted-foreground text-lg">
          SolowCrew combines the financial benefits of group travel with the freedom of solo adventures.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
