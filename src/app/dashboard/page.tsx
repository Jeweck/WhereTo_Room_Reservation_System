
"use client"

import { useStore } from '@/hooks/use-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CalendarCheck, Clock, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function DashboardOverview() {
  const { currentUser, facilities, bookings } = useStore();
  
  const myBookings = currentUser?.role === 'admin' 
    ? bookings 
    : bookings.filter(b => b.userId === currentUser?.id);
    
  const activeBookings = myBookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = myBookings.filter(b => b.status === 'pending').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-headline font-bold text-primary">Welcome back, {currentUser?.name}</h1>
        <p className="text-muted-foreground">Here is what's happening on campus today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarCheck className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary uppercase">Total</span>
            </div>
            <div className="text-3xl font-bold">{myBookings.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Bookings managed</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
              </div>
              <span className="text-xs font-semibold text-secondary uppercase">Active</span>
            </div>
            <div className="text-3xl font-bold">{activeBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed reservations</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-xs font-semibold text-yellow-600 uppercase">Pending</span>
            </div>
            <div className="text-3xl font-bold">{pendingBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 uppercase">Availability</span>
            </div>
            <div className="text-3xl font-bold">{facilities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total facilities</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {myBookings.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <CalendarCheck className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p>No upcoming reservations found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.filter(b => b.status === 'confirmed').slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-accent/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white flex flex-col items-center justify-center border shadow-sm">
                        <span className="text-[10px] font-bold text-primary uppercase">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-lg font-bold">{new Date(booking.date).getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{booking.facilityName}</h4>
                        <p className="text-xs text-muted-foreground">{booking.startTime} - {booking.endTime} &bull; {booking.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/10 text-secondary">Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Lecture Halls</span>
                <span className="font-semibold">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Meeting Rooms</span>
                <span className="font-semibold">42%</span>
              </div>
              <Progress value={42} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Study Suites</span>
                <span className="font-semibold">91%</span>
              </div>
              <Progress value={91} className="h-2" />
            </div>
            <div className="pt-4 border-t">
              <div className="bg-primary p-4 rounded-xl text-white">
                <h5 className="font-bold mb-1">AI Suggestion</h5>
                <p className="text-xs text-white/80 leading-relaxed">
                  Study suites are currently at peak demand. We recommend booking Study Suite 101 for sessions after 4:00 PM.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
