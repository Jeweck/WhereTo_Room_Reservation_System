
"use client"

import { useStore } from '@/hooks/use-store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  Inbox,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminPage() {
  const { bookings, currentUser, approveBooking, cancelBooking, clearAllBookings } = useStore();

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const allBookings = bookings;

  if (currentUser?.role !== 'admin') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You do not have administrative privileges to view this page.</p>
      </div>
    );
  }

  const handleClearAll = () => {
    clearAllBookings();
    toast({
      title: "Records Cleared",
      description: "All reservation records have been permanently removed.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-secondary" />
            Admin Approval Center
          </h1>
          <p className="text-muted-foreground">Review and manage student and faculty reservation requests.</p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white p-1 border shadow-sm max-w-md">
          <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Pending ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            All Records ({allBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {pendingBookings.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground bg-white rounded-xl border border-dashed">
                <Inbox className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p>No pending requests at the moment.</p>
              </div>
            ) : (
              pendingBookings.map((booking) => (
                <Card key={booking.id} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-2 bg-yellow-400" />
                      <div className="flex-1 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{booking.facilityName}</h3>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              PENDING
                            </Badge>
                          </div>
                          <div className="flex flex-col text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-primary">Requested by: {booking.userName}</span>
                              <Badge variant="outline" className="text-[10px] h-5 px-2 uppercase font-bold border-secondary/50 text-secondary bg-secondary/5">
                                {booking.userRole}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{booking.date} | {booking.startTime} - {booking.endTime}</span>
                            </div>
                            <p className="mt-2 text-sm text-foreground bg-accent/30 p-2 rounded-lg italic">
                              "{booking.purpose}"
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                          <Button 
                            className="flex-1 md:flex-none bg-green-600 text-white hover:bg-green-700"
                            onClick={() => {
                              approveBooking(booking.id);
                              toast({ title: "Approved", description: "The reservation has been confirmed." });
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1 md:flex-none text-destructive hover:bg-destructive/10 border-destructive/20"
                            onClick={() => {
                              cancelBooking(booking.id);
                              toast({ title: "Rejected", description: "The reservation has been rejected." });
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {allBookings.length > 0 && (
            <div className="flex justify-end px-1">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 border-destructive/20 font-semibold">
                    <Trash2 className="w-4 h-4 mr-2" /> Clear All Records
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all reservation history and records from the system.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Clear Records
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            {allBookings.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground bg-white rounded-xl border border-dashed">
                <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p>No booking records found.</p>
              </div>
            ) : (
              allBookings.map((booking) => (
                <Card key={booking.id} className="border-none shadow-sm overflow-hidden opacity-90 hover:opacity-100 transition-opacity">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className={`w-2 ${
                        booking.status === 'confirmed' ? 'bg-green-600' : 
                        booking.status === 'pending' ? 'bg-yellow-400' : 'bg-destructive'
                      }`} />
                      <div className="flex-1 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{booking.facilityName}</h3>
                            <Badge variant={booking.status === 'confirmed' ? 'secondary' : booking.status === 'pending' ? 'outline' : 'destructive'}>
                              {booking.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{booking.userName}</span>
                              <Badge variant="outline" className="text-[9px] h-4 px-1.5 uppercase font-bold opacity-70">
                                {booking.userRole}
                              </Badge>
                            </div>
                            <span>{booking.date} • {booking.startTime} - {booking.endTime}</span>
                          </div>
                        </div>
                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => approveBooking(booking.id)}>Approve</Button>
                            <Button size="sm" variant="outline" className="text-destructive" onClick={() => cancelBooking(booking.id)}>Reject</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
