
"use client"

import { useState } from 'react';
import { useStore } from '@/hooks/use-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays,
  Inbox,
  Trash2,
  Plus,
  Building2
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminPage() {
  const { 
    bookings, 
    currentUser, 
    approveBooking, 
    cancelBooking, 
    clearAllBookings,
    facilities,
    upsertFacility,
    deleteFacility
  } = useStore();

  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({
    id: '',
    name: '',
    capacity: '30',
    purpose: 'Classroom',
    equipment: ''
  });

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

  const handleApprove = (id: string) => {
    approveBooking(id);
    toast({ 
      title: "Confirmed", 
      description: "Reservation confirmed. Overlapping pending requests have been automatically rejected." 
    });
  };

  const handleAddRoom = () => {
    if (!newRoom.id || !newRoom.name) {
      toast({ title: "Error", description: "Room ID and Name are required.", variant: "destructive" });
      return;
    }

    upsertFacility({
      id: newRoom.id,
      name: newRoom.name,
      capacity: parseInt(newRoom.capacity),
      purpose: newRoom.purpose,
      equipment: newRoom.equipment.split(',').map(e => e.trim()).filter(Boolean),
      description: `${newRoom.purpose} room located on campus.`,
      imageUrl: ''
    });

    toast({ title: "Success", description: `Room ${newRoom.id} added to inventory.` });
    setIsAddRoomOpen(false);
    setNewRoom({ id: '', name: '', capacity: '30', purpose: 'Classroom', equipment: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-secondary" />
            Admin Control Center
          </h1>
          <p className="text-muted-foreground">Review and manage campus reservation requests.</p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white p-1 border shadow-sm max-w-md">
          <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Requests ({pendingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            History
          </TabsTrigger>
          <TabsTrigger value="facilities" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Facilities ({facilities.length})
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
                              <span className="font-medium text-primary">By: {booking.userName}</span>
                              <Badge variant="outline" className="text-[10px] h-5 px-2 uppercase font-bold border-secondary/50 text-secondary bg-secondary/5">
                                {booking.userRole}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{booking.date} | {booking.startTime} - {booking.endTime}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                          <Button 
                            className="flex-1 md:flex-none bg-green-600 text-white hover:bg-green-700"
                            onClick={() => handleApprove(booking.id)}
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
                    <AlertDialogTitle>Clear Logs?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove all booking history.
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
                <Card key={booking.id} className="border-none shadow-sm overflow-hidden opacity-90">
                  <CardContent className="p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{booking.facilityName}</h3>
                      <p className="text-xs text-muted-foreground">{booking.date} • {booking.userName}</p>
                    </div>
                    <Badge variant={booking.status === 'confirmed' ? 'secondary' : booking.status === 'pending' ? 'outline' : 'destructive'}>
                      {booking.status.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Campus Inventory
            </h2>
            <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white">
                  <Plus className="w-4 h-4 mr-2" /> Add New Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register New Facility</DialogTitle>
                  <DialogDescription>
                    Add a new room to the school's inventory.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rid">Room Number / ID</Label>
                    <Input id="rid" placeholder="e.g. R101, Lab 301" value={newRoom.id} onChange={(e) => setNewRoom({...newRoom, id: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rname">Display Name</Label>
                    <Input id="rname" placeholder="e.g. Room 101" value={newRoom.name} onChange={(e) => setNewRoom({...newRoom, name: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rpurpose">Category</Label>
                    <Select value={newRoom.purpose} onValueChange={(val) => setNewRoom({...newRoom, purpose: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Classroom">Classroom</SelectItem>
                        <SelectItem value="Theater">Theater</SelectItem>
                        <SelectItem value="PE Hall">PE Hall</SelectItem>
                        <SelectItem value="Computer Lab">Computer Lab</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="rcap">Capacity (Chairs)</Label>
                    <Input id="rcap" type="number" value={newRoom.capacity} onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="req">Equipment (Comma separated)</Label>
                    <Input id="req" placeholder="TV, Whiteboard, PCs" value={newRoom.equipment} onChange={(e) => setNewRoom({...newRoom, equipment: e.target.value})} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddRoomOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddRoom}>Save Facility</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facilities.map((f) => (
              <Card key={f.id} className="border-none shadow-sm group">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-primary">
                      {f.id}
                    </div>
                    <div>
                      <h3 className="font-bold">{f.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] h-4">{f.purpose}</Badge>
                        <span className="text-xs text-muted-foreground">{f.capacity} chairs</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      deleteFacility(f.id);
                      toast({ title: "Deleted", description: `Room ${f.id} removed.` });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
