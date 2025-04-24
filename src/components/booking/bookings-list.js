'use client';

import { useState } from 'react';
import { BookingCard } from '@/components/booking/booking-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';

export function BookingsList({ bookings }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter bookings based on search query and tab
  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    if (activeTab !== 'all' && booking.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        booking.deals.title.toLowerCase().includes(searchLower) ||
        booking.deals.location.toLowerCase().includes(searchLower) ||
        booking.deals.providers.company_name.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Group bookings by upcoming/past
  const now = new Date();
  const upcomingBookings = filteredBookings.filter(
    booking => new Date(booking.deals.start_date) > now
  );
  const pastBookings = filteredBookings.filter(
    booking => new Date(booking.deals.start_date) <= now
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bookings..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Calendar className="h-4 w-4 mr-2" />
          Download Itinerary
        </Button>
      </div>
      
      <Tabs
        defaultValue="all"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6 space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No bookings found
            </div>
          ) : (
            <>
              {upcomingBookings.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Upcoming Trips</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {upcomingBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </div>
              )}
              
              {pastBookings.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Past Trips</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {pastBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="confirmed" className="mt-6 space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No confirmed bookings found
            </div>
          ) : (
            <>
              {upcomingBookings.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Upcoming Trips</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {upcomingBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </div>
              )}
              
              {pastBookings.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Past Trips</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {pastBookings.map(booking => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No pending bookings found
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-6">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No cancelled bookings found
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
