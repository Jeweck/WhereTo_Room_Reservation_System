
"use client"

import { useState } from 'react';
import { useStore } from '@/hooks/use-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Users, 
  Package, 
  ChevronRight,
  Filter,
  School,
  Monitor,
  Dumbbell,
  Layout
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { label: 'All', icon: Layout },
  { label: 'Classroom', icon: School },
  { label: 'Theater', icon: Layout },
  { label: 'PE Hall', icon: Dumbbell },
  { label: 'Computer Lab', icon: Monitor },
];

export default function FacilitiesPage() {
  const { facilities, currentUser, addBooking, bookings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  
  // Booking Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  const filteredFacilities = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || f.purpose === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const checkConflicts = (facilityId: string, bookingDate: string, start: string, end: string) => {
    return bookings.some(b => 
      b.facilityId === facilityId && 
      b.date === bookingDate && 
      (b.status === 'confirmed' || b.status === 'pending') &&
      ((start >= b.startTime && start < b.endTime) || (end > b.startTime && end <= b.endTime))
    );
  };

  const handleBooking = () => {
    if (!selectedFacility || !date || !startTime || !endTime || !purpose) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    if (checkConflicts(selectedFacility.id, date, startTime, endTime)) {
      toast({ 
        title: "Schedule Conflict", 
        description: "This time slot is either booked or has a pending request.", 
        variant: "destructive" 
      });
      return;
    }

    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      facilityId: selectedFacility.id,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest',
      userRole: currentUser?.role || 'student',
      facilityName: selectedFacility.name,
      date,
      startTime,
      endTime,
      purpose,
      status: 'pending' as const
    };

    addBooking(newBooking);
    toast({ 
      title: "Request Submitted", 
      description: "Your reservation request has been sent for administrative approval." 
    });
    setSelectedFacility(null);
    setPurpose('');
    setDate('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Browse Facilities</h1>
          <p className="text-muted-foreground">Find the perfect space for your next activity.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search facilities..." 
              className="pl-9 bg-white border-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat.label}
            variant={selectedCategory === cat.label ? "default" : "outline"}
            className={cn(
              "rounded-full px-6 flex items-center gap-2 border-none shadow-sm transition-all whitespace-nowrap",
              selectedCategory === cat.label ? "bg-primary text-white" : "bg-white hover:bg-accent/50"
            )}
            onClick={() => setSelectedCategory(cat.label)}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            <School className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p className="text-xl">No facilities found matching your criteria.</p>
          </div>
        ) : (
          filteredFacilities.map((facility) => (
            <Card key={facility.id} className="overflow-hidden border-none shadow-md group hover:shadow-xl transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <Image 
                  src={facility.imageUrl} 
                  alt={facility.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm border-none shadow-sm">
                    {facility.purpose}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-secondary transition-colors line-clamp-1">{facility.name}</CardTitle>
                <CardDescription className="line-clamp-2 h-10">{facility.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-secondary" />
                    <span>Up to {facility.capacity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-secondary" />
                    <span>{facility.equipment.length} items</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-accent/20 pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full group" 
                      onClick={() => setSelectedFacility(facility)}
                    >
                      Reserve Now
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Reserve {selectedFacility?.name}</DialogTitle>
                      <DialogDescription>
                        Your reservation will be sent to the administrator for approval.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="start">Start Time</Label>
                          <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="end">End Time</Label>
                          <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="purpose">Purpose</Label>
                        <Input id="purpose" placeholder="Ex: Student Org Meeting" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={handleBooking} className="w-full">Submit for Approval</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          )
        ))}
      </div>
    </div>
  );
}
