import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Calendar, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail, 
  Building2, 
  Download, 
  FileText, 
  Printer
} from 'lucide-react';

export function BookingDetails({ booking }) {
  const {
    id,
    status,
    amount_paid,
    created_at,
    booking_details,
    deals,
  } = booking;
  
  // Format dates
  const bookingDate = new Date(created_at);
  const startDate = new Date(deals.start_date);
  const endDate = new Date(deals.end_date);
  
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">{deals.title}</h1>
          <div className="flex items-center text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{deals.location}</span>
          </div>
        </div>
        <Badge variant={getBadgeVariant(status)} className="text-sm py-1 px-3">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Booking Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
              <CardDescription>
                Booking #{id.slice(0, 8)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Trip Dates</p>
                  <p className="font-medium flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking Date</p>
                  <p className="font-medium flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    {bookingDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="font-medium flex items-center mt-1">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    ${amount_paid}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium flex items-center mt-1">
                    <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                    {booking_details?.paymentMethod || 'Credit Card'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-muted-foreground">
                {deals.description}
              </p>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Itinerary</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="day-1">
                    <AccordionTrigger>Day 1: Arrival & Welcome</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>Arrival at destination</li>
                        <li>Transfer to accommodation</li>
                        <li>Welcome reception</li>
                        <li>Free time to explore</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="day-2">
                    <AccordionTrigger>Day 2: Exploration</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>Breakfast at accommodation</li>
                        <li>Guided tour of main attractions</li>
                        <li>Lunch at local restaurant</li>
                        <li>Free afternoon</li>
                        <li>Optional group dinner</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="day-3">
                    <AccordionTrigger>Day 3: Activities</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>Breakfast at accommodation</li>
                        <li>Morning activity (based on destination)</li>
                        <li>Lunch included</li>
                        <li>Afternoon free time</li>
                        <li>Evening cultural experience</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="day-4">
                    <AccordionTrigger>Day 4: Departure</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-muted-foreground">
                        <li>Breakfast at accommodation</li>
                        <li>Check-out</li>
                        <li>Transfer to departure point</li>
                        <li>End of services</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
            <CardFooter className="flex justify-start gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Itinerary
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print Details
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right Column - Provider & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {deals.providers.logo_url ? (
                    <img
                      src={deals.providers.logo_url}
                      alt={deals.providers.company_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{deals.providers.company_name}</h3>
                  <p className="text-sm text-muted-foreground">Travel Provider</p>
                </div>
              </div>
              
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Contact</h4>
                <div className="space-y-2">
                  <p className="text-sm flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    +1 (555) 123-4567
                  </p>
                  <p className="text-sm flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    {deals.providers.contact_email || 'contact@provider.com'}
                  </p>
                  <p className="text-sm flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    {deals.providers.website || 'www.provider.com'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="border rounded-md p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Booking Confirmation</p>
                    <p className="text-xs text-muted-foreground">PDF • 156 KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="border rounded-md p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Receipt</p>
                    <p className="text-xs text-muted-foreground">PDF • 98 KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="border rounded-md p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Detailed Itinerary</p>
                    <p className="text-xs text-muted-foreground">PDF • 235 KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you need to make changes to your booking or have any questions, please contact our support team.
              </p>
              <Button className="w-full">Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
