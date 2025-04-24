'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Calendar, Users, Clock } from 'lucide-react';

export function DealCard({ deal, compact = false }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const discountPercentage = 
    Math.round(100 - (deal.discountedPrice / deal.originalPrice * 100));
  
  const timeLeft = formatDistance(
    new Date(deal.bookingDeadline),
    new Date(),
    { addSuffix: true }
  );
  
  const poolProgress = (deal.currentTravelers / deal.minTravelers) * 100;

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 ${
        isHovered ? 'shadow-lg' : 'shadow-md'
      } ${compact ? 'h-full' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <Image
            src={deal.thumbnailUrl || '/images/placeholder.jpg'}
            alt={deal.title}
            width={500}
            height={300}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
        </div>
        <Badge className="absolute top-3 right-3 bg-primary text-white">
          {discountPercentage}% OFF
        </Badge>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl line-clamp-1">{deal.title}</CardTitle>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{deal.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-muted-foreground line-through text-sm">
              ${deal.originalPrice}
            </div>
            <div className="text-primary font-bold text-xl">
              ${deal.discountedPrice}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        {!compact && (
          <CardDescription className="line-clamp-2 mb-4">
            {deal.description}
          </CardDescription>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Ends {timeLeft}</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{deal.currentTravelers} joined</span>
              </span>
              <span className="text-primary">
                {deal.currentTravelers}/{deal.minTravelers} needed
              </span>
            </div>
            <Progress value={poolProgress} className="h-2" />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={deal.providerLogo} alt={deal.providerName} />
              <AvatarFallback>{deal.providerName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{deal.providerName}</span>
          </div>
          <Link href={`/explore/${deal.id}`} passHref>
            <Button size="sm">View Deal</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
