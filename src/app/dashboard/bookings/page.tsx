
"use client"

import { useStore } from '@/hooks/use-store';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  History,
  AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MyBookingsPage() {
  const { bookings, currentUser, cancelBooking } = useStore();

  const myBookings = bookings.filter(b => b.userId === currentUser?.id);

  const activeBookings = myBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = myBookings.filter(b => b.status === 'cancelled');

  const handleCancel = (id: string) => {
    cancelBooking(id);
    toast({ title: "Booking Cancelled", description: "Your reservation has been removed." });
  };

  const BookingList = ({ list }: { list: any[] }) => (
    <div className="grid gap-4">
      {list.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          <History className="w-12 h-12 mx-auto mb-4 opacity-10" />
          <p>No reservations found in this category.</p>
        </div>
      ) : (
        list.map((booking) => (
          <Card key={booking.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className={`md:w-2 ${
                  booking.status === 'confirmed' ? 'bg-secondary' : 
                  booking.status === 'pending' ? 'bg-yellow-400' : 'bg-destructive/50'
                }`} />
                <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-primary/5 items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{booking.facilityName}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{booking.date} &bull; {booking.startTime} - {booking.endTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>Main Campus</span>
                        </div>
                      </div>
                      <p className="text-sm mt-3 text-primary/80 font-medium">Purpose: {booking.purpose}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                    <div className="text-right">
                      {booking.status === 'confirmed' ? (
                        <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none px-3 py-1">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
                        </Badge>
                      ) : booking.status === 'pending' ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 px-3 py-1">
                          <AlertCircle className="w-3 h-3 mr-1" /> Pending Approval
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="px-3 py-1">
                          <XCircle className="w-3 h-3 mr-1" /> Cancelled / Rejected
                        </Badge>
                      )}
                    </div>
                    
                    {(booking.status === 'confirmed' || booking.status === 'pending') && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleCancel(booking.id)}>
                            Cancel Reservation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">My Reservations</h1>
          <p className="text-muted-foreground">Manage your current and past facility requests.</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-white p-1 border shadow-sm">
          <TabsTrigger value="active" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
            Current & Pending ({activeBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
            History / Rejected ({pastBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <BookingList list={activeBookings} />
        </TabsContent>
        <TabsContent value="past">
          <BookingList list={pastBookings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
