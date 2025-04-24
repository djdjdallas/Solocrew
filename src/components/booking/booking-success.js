import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Download, 
  Share2 
} from 'lucide-react';

export function BookingSuccess({ booking }) {
  const {
    id,
    amount_paid,
    deals,
  } = booking;
  
  // Format dates
  const startDate = new Date(deals.start_date);
  const endDate = new Date(deals.end_date);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
        <p className="text-muted-foreground mt-2">
          Your booking has been successfully completed and confirmed.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>
            Booking #{id.slice(0, 8)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">{deals.title}</h2>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{deals.location}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Trip Dates</p>
              <p className="font-medium flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="font-medium mt-1">
                ${amount_paid}
              </p>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">What's Next?</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5" />
                <span>You'll receive a confirmation email shortly</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5" />
                <span>Your detailed itinerary can be downloaded from your bookings page</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-primary mt-0.5" />
                <span>The provider will contact you with final details as your trip date approaches</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Share2 className="h-4 w-4 mr-2" />
            Share Booking
          </Button>
        </CardFooter>
      </Card>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
        <Link href="/bookings" className="text-sm text-primary hover:underline flex items-center">
          <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
          View All Bookings
        </Link>
        <Button asChild>
          <Link href="/explore">
            Explore More Deals
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
