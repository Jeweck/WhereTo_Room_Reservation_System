
"use client"

import { useState } from 'react';
import { useStore } from '@/hooks/use-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ShieldCheck, 
  Building2, 
  Users, 
  Settings2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarDays
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const { facilities, bookings, currentUser, upsertFacility, deleteFacility, approveBooking, cancelBooking } = useStore();
  const [editingFacility, setEditingFacility] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [equipment, setEquipment] = useState('');

  const resetForm = () => {
    setName('');
    setCapacity('');
    setPurpose('');
    setDescription('');
    setEquipment('');
    setEditingFacility(null);
  };

  const handleEdit = (facility: any) => {
    setEditingFacility(facility);
    setName(facility.name);
    setCapacity(facility.capacity.toString());
    setPurpose(facility.purpose);
    setDescription(facility.description);
    setEquipment(facility.equipment.join(', '));
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!name || !capacity || !purpose) {
      toast({ title: "Error", description: "Required fields are missing", variant: "destructive" });
      return;
    }

    const facilityData = {
      id: editingFacility?.id || `F${Math.floor(Math.random() * 900) + 100}`,
      name,
      capacity: parseInt(capacity),
      purpose,
      description,
      equipment: equipment.split(',').map(item => item.trim()).filter(Boolean),
      imageUrl: editingFacility?.imageUrl || 'https://picsum.photos/seed/admin/800/600'
    };

    upsertFacility(facilityData);
    toast({ title: "Facility Saved", description: `${name} has been successfully updated.` });
    setIsDialogOpen(false);
    resetForm();
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You do not have administrative privileges to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-secondary" />
            Admin Control Center
          </h1>
          <p className="text-muted-foreground">Manage campus facilities and reservation requests.</p>
        </div>
      </div>

      <Tabs defaultValue="facilities" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white p-1 border shadow-sm max-w-md">
          <TabsTrigger value="facilities" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Facilities ({facilities.length})
          </TabsTrigger>
          <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            Bookings ({bookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="facilities" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-secondary text-white hover:bg-secondary/90 h-11 px-6 rounded-xl font-bold">
                  <Plus className="mr-2 h-5 w-5" /> Add Facility
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>{editingFacility ? 'Edit Facility' : 'Create New Facility'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Facility Name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Lab 204" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purpose">Primary Purpose</Label>
                    <Input id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g. Laboratory, Lecture" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="equipment">Equipment (comma separated)</Label>
                    <Input id="equipment" value={equipment} onChange={(e) => setEquipment(e.target.value)} placeholder="Projector, Whiteboard, PCs..." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleSubmit}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {facilities.map((facility) => (
              <Card key={facility.id} className="border-none shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{facility.name}</h3>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">{facility.id}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>{facility.capacity} seats</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Settings2 className="w-4 h-4" />
                          <span>{facility.equipment.length} assets configured</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(facility)}>
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the <strong>{facility.name}</strong> facility and all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => {
                              deleteFacility(facility.id);
                              toast({ title: "Deleted", description: "Facility removed from system." });
                            }}>
                              Delete Facility
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {bookings.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground">
                <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p>No booking requests to manage.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} className="border-none shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className={`w-2 ${
                        booking.status === 'confirmed' ? 'bg-secondary' : 
                        booking.status === 'pending' ? 'bg-yellow-400' : 'bg-destructive'
                      }`} />
                      <div className="flex-1 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{booking.facilityName}</h3>
                            <Badge variant={booking.status === 'confirmed' ? 'secondary' : 'outline'}>
                              {booking.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex flex-col text-sm text-muted-foreground">
                            <span className="font-medium text-primary">Requested by: {booking.userName}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{booking.date} | {booking.startTime} - {booking.endTime}</span>
                            </div>
                            <p className="mt-1 text-xs italic">" {booking.purpose} "</p>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                          {booking.status === 'pending' && (
                            <Button 
                              size="sm" 
                              className="flex-1 md:flex-none bg-secondary text-white hover:bg-secondary/90"
                              onClick={() => {
                                approveBooking(booking.id);
                                toast({ title: "Approved", description: "The reservation has been confirmed." });
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                            </Button>
                          )}
                          {booking.status !== 'cancelled' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 md:flex-none text-destructive hover:bg-destructive/10 border-destructive/20"
                              onClick={() => {
                                cancelBooking(booking.id);
                                toast({ title: "Cancelled", description: "The reservation has been rejected/cancelled." });
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Cancel
                            </Button>
                          )}
                        </div>
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
