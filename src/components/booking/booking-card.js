import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Calendar, 
  ArrowRight
} from 'lucide-react';

export function BookingCard({ booking }) {
  const {
    id,
    status,
    amount_paid,
    created_at,
    deals,
  } = booking;
  
  // Format dates
  const bookingDate = new Date(created_at);
  const startDate = new Date(deals.start_date);
  const endDate = new Date(deals.end_date);
  
  // Get time until trip
  const timeUntilTrip = startDate > new Date() 
    ? formatDistanceToNow(startDate, { addSuffix: true })
    : 'Past trip';
  
  // Badge color based on status
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{deals.title}</CardTitle>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{deals.location}</span>
            </div>
          </div>
          <Badge variant={getBadgeVariant(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </span>
          </div>
          <div className="text-primary font-medium">
            {timeUntilTrip}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={deals.providers?.logo_url} alt={deals.providers?.company_name} />
              <AvatarFallback>{deals.providers?.company_name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{deals.providers?.company_name}</span>
          </div>
          <div className="text-lg font-bold">
            ${amount_paid}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full flex justify-between">
          <div className="text-xs text-muted-foreground">
            Booked on {bookingDate.toLocaleDateString()}
          </div>
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/bookings/${id}`}>
              View Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
