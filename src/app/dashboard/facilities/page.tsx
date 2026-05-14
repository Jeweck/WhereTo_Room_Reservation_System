
"use client"

import { useState } from 'react';
import { useStore } from '@/hooks/use-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  School,
  Monitor,
  Dumbbell,
  Theater,
  CheckCircle2,
  Calendar,
  ArrowLeft,
  Tv,
  Computer,
  Info,
  AlertCircle,
  Search,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CATEGORIES = [
  { label: 'Classroom', icon: School, description: 'Standard rooms for lectures' },
  { label: 'Theater', icon: Theater, description: 'Large performance spaces' },
  { label: 'PE Hall', icon: Dumbbell, description: 'Sports and fitness areas' },
  { label: 'Computer Lab', icon: Monitor, description: 'IT and programming labs' },
];

export default function FindRoomPage() {
  const { currentUser, addBooking, facilities, bookings } = useStore();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Requirement State
  const [category, setCategory] = useState('');
  const [chairs, setChairs] = useState('20');
  const [needsTv, setNeedsTv] = useState(false);
  const [needsPcs, setNeedsPcs] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Results State
  const [recommendations, setRecommendations] = useState<any[]>([]);

  /**
   * Robust Time Overlap Detection
   */
  const isTimeOverlap = (s1: string, e1: string, s2: string, e2: string) => {
    return s1 < e2 && e1 > s2;
  };

  const handleFindRoom = () => {
    if (!category || !chairs || !purpose || !date || !startTime || !endTime) {
      toast({ 
        title: "Incomplete Request", 
        description: "Please specify all requirements including date and time.", 
        variant: "destructive" 
      });
      return;
    }

    if (startTime >= endTime) {
      toast({
        title: "Invalid Time Range",
        description: "Start time must be earlier than the end time.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Constraint-Based Matching Engine
    setTimeout(() => {
      const requiredChairs = parseInt(chairs);
      
      const matched = facilities.filter(f => {
        // 1. Category Constraint
        if (f.purpose !== category) return false;
        
        // 2. Capacity Constraint
        if (f.capacity < requiredChairs) return false;
        
        // 3. Equipment Constraints
        if (needsTv && !f.equipment.some(e => e.toLowerCase().includes('tv'))) return false;
        if (needsPcs && !f.equipment.some(e => e.toLowerCase().includes('pc') || e.toLowerCase().includes('computer'))) return false;

        // 4. Scheduling Constraint (CRITICAL: Prevents Double Booking)
        const hasConflict = bookings.some(b => 
          b.facilityId === f.id && 
          b.date === date && 
          (b.status === 'confirmed' || b.status === 'pending') &&
          isTimeOverlap(startTime, endTime, b.startTime, b.endTime)
        );

        return !hasConflict;
      });

      const sorted = matched.sort((a, b) => a.capacity - b.capacity);

      setRecommendations(sorted.map(r => ({
        ...r,
        suitabilityReason: `Verified available for ${date} (${startTime}-${endTime}). Fits all your requested constraints.`
      })));
      
      setStep(3);
      setLoading(false);
    }, 800);
  };

  const handleBooking = (rec: any) => {
    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      facilityId: rec.id,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest',
      userRole: currentUser?.role || 'student',
      facilityName: rec.name,
      date,
      startTime,
      endTime,
      purpose,
      status: 'pending' as const
    };

    addBooking(newBooking);
    toast({ 
      title: "Request Submitted", 
      description: `Reservation for ${rec.name} has been sent for administrative approval.` 
    });
    setStep(1);
    setPurpose('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-headline font-bold text-primary">Browse Facilities</h1>
        <p className="text-muted-foreground">Select a category to start your requirement-based search.</p>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.map((cat) => (
            <Card 
              key={cat.label} 
              className={`cursor-pointer border-2 transition-all hover:shadow-xl group ${category === cat.label ? 'border-secondary bg-secondary/5 shadow-lg' : 'border-transparent shadow-md'}`}
              onClick={() => {
                setCategory(cat.label);
                setStep(2);
              }}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <cat.icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>{cat.label}s</CardTitle>
                  <CardDescription>{cat.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {step === 2 && (
        <Card className="border-none shadow-2xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="p-0 h-auto hover:bg-transparent text-primary">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Categories
              </Button>
              <Badge variant="secondary">{category}</Badge>
            </div>
            <CardTitle>Room Requirements</CardTitle>
            <CardDescription>We'll find rooms that aren't already requested or booked.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="chairs">Number of Chairs (Minimum)</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="chairs" type="number" className="pl-10" value={chairs} onChange={(e) => setChairs(e.target.value)} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purpose">Purpose of Use</Label>
                  <Input id="purpose" placeholder="e.g. Workshop, Seminar" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Essential Equipment Constraints</Label>
                <div className="flex flex-col gap-3 p-4 bg-accent/30 rounded-lg border border-accent/50">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="tv" checked={needsTv} onCheckedChange={(checked) => setNeedsTv(!!checked)} />
                    <Label htmlFor="tv" className="flex items-center gap-2 cursor-pointer">
                      <Tv className="w-4 h-4" /> Smart TV
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="pcs" checked={needsPcs} onCheckedChange={(checked) => setNeedsPcs(!!checked)} />
                      <Label htmlFor="pcs" className="flex items-center gap-2 cursor-pointer">
                        <Computer className="w-4 h-4" /> Personal Computers
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2"><Clock className="w-3 h-3" /> Start Time</Label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label className="flex items-center gap-2"><Clock className="w-3 h-3" /> End Time</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full h-12 text-lg font-bold bg-primary text-white hover:opacity-90 shadow-lg" onClick={handleFindRoom} disabled={loading}>
              <Search className="w-5 h-5 mr-2" />
              {loading ? "Checking Inventory..." : "Run Automated Matching Engine"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Adjust Constraints
            </Button>
            <Badge className="bg-secondary text-secondary-foreground font-bold px-3 py-1">
              {recommendations.length} AVAILABLE MATCHES
            </Badge>
          </div>

          <Alert className="bg-primary/5 border-primary/20 shadow-sm">
            <Info className="w-4 h-4 text-primary" />
            <AlertTitle className="font-bold text-primary">Matching Algorithm Report</AlertTitle>
            <AlertDescription className="text-sm leading-relaxed mt-1">
              Only rooms with zero overlapping requests (pending or confirmed) for your time slot are displayed.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            {recommendations.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground border-dashed shadow-md">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium text-lg">No Availability for this Slot</p>
                <p className="text-sm">Selected rooms are currently booked or have pending requests.</p>
              </Card>
            ) : (
              recommendations.map((rec) => (
                <Card key={rec.id} className="border-none shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-40 bg-primary text-white p-6 flex flex-col justify-center items-center text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Room No.</span>
                      <h3 className="text-3xl font-black">{rec.id}</h3>
                    </div>
                    <CardContent className="flex-1 p-6 space-y-4">
                      <div>
                        <h4 className="font-bold text-lg text-primary">{rec.name}</h4>
                        <p className="text-sm text-muted-foreground">Max Capacity: {rec.capacity} chairs</p>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-secondary flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> CONFLICT-FREE
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">{rec.suitabilityReason}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rec.equipment.map((eq: string) => (
                          <span key={eq} className="px-2 py-0.5 rounded bg-accent text-[10px] font-bold text-primary uppercase border border-primary/10">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <div className="p-6 md:border-l border-dashed flex flex-col justify-center bg-accent/10">
                      <Button className="w-full md:w-auto font-bold bg-secondary hover:bg-secondary/90 text-white shadow-md" onClick={() => handleBooking(rec)}>
                        Reserve Room
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
