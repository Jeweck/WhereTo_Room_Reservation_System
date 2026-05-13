
"use client"

import { useState } from 'react';
import { useStore } from '@/hooks/use-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  ChevronRight,
  School,
  Monitor,
  Dumbbell,
  Theater,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Tv,
  Computer,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from '@/hooks/use-toast';
import { recommendFacility } from '@/ai/flows/recommend-facility';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CATEGORIES = [
  { label: 'Classroom', icon: School, description: 'Standard rooms for lectures and seminars' },
  { label: 'Theater', icon: Theater, description: 'Auditoriums and performance spaces' },
  { label: 'PE Hall', icon: Dumbbell, description: 'Sports and fitness facilities' },
  { label: 'Computer Lab', icon: Monitor, description: 'Tech-focused rooms with workstations' },
];

export default function FindRoomPage() {
  const { currentUser, addBooking } = useStore();
  
  // Navigation State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Requirement State
  const [category, setCategory] = useState('');
  const [chairs, setChairs] = useState('20');
  const [needsTv, setNeedsTv] = useState(false);
  const [needsPcs, setNeedsPcs] = useState(false);
  const [pcCount, setPcCount] = useState('0');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Results State
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [aiExplanation, setAiExplanation] = useState('');

  const handleFindRoom = async () => {
    if (!category || !chairs || !purpose || !date || !startTime || !endTime) {
      toast({ title: "Missing Info", description: "Please fill in all basic requirements.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const requestString = `I need a ${category} for ${chairs} people on ${date} from ${startTime} to ${endTime} for ${purpose}. ${needsTv ? 'I need a TV.' : ''} ${needsPcs ? `I need at least ${pcCount} PCs.` : ''}`;
      
      const result = await recommendFacility({ userRequest: requestString });
      setRecommendations(result.recommendations);
      setAiExplanation(result.aiExplanation);
      setStep(3);
    } catch (error) {
      toast({ title: "Search Error", description: "The AI assistant is temporarily unavailable.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
      description: `Reservation request for ${rec.name} has been sent for approval.` 
    });
    // Reset to step 1
    setStep(1);
    setCategory('');
    setPurpose('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-headline font-bold text-primary">Find the Perfect Room</h1>
        <p className="text-muted-foreground">Specify your requirements and let our AI suggest the best space.</p>
      </div>

      {/* STEP 1: CATEGORY SELECTION */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <Card 
              key={cat.label} 
              className={`cursor-pointer border-2 transition-all hover:shadow-md ${category === cat.label ? 'border-primary bg-primary/5' : 'border-transparent'}`}
              onClick={() => {
                setCategory(cat.label);
                setStep(2);
              }}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
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

      {/* STEP 2: REQUIREMENTS FORM */}
      {step === 2 && (
        <Card className="border-none shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="p-0 h-auto">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Badge variant="secondary">{category}</Badge>
            </div>
            <CardTitle>Room Requirements</CardTitle>
            <CardDescription>What do you need for your {category}?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="chairs">Number of Chairs (Capacity)</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="chairs" 
                      type="number" 
                      className="pl-10" 
                      value={chairs} 
                      onChange={(e) => setChairs(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="purpose">Purpose of Reservation</Label>
                  <Input 
                    id="purpose" 
                    placeholder="Ex: Coding Workshop" 
                    value={purpose} 
                    onChange={(e) => setPurpose(e.target.value)} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>Additional Equipment</Label>
                  <div className="flex flex-col gap-3 p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tv" checked={needsTv} onCheckedChange={(checked) => setNeedsTv(!!checked)} />
                      <Label htmlFor="tv" className="flex items-center gap-2 cursor-pointer">
                        <Tv className="w-4 h-4 text-primary" /> Smart TV
                      </Label>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pcs" checked={needsPcs} onCheckedChange={(checked) => setNeedsPcs(!!checked)} />
                        <Label htmlFor="pcs" className="flex items-center gap-2 cursor-pointer">
                          <Computer className="w-4 h-4 text-primary" /> Personal Computers
                        </Label>
                      </div>
                      {needsPcs && (
                        <div className="pl-6 mt-1">
                          <Label htmlFor="pcCount" className="text-xs text-muted-foreground">Minimum PCs needed</Label>
                          <Input 
                            id="pcCount" 
                            type="number" 
                            className="h-8 w-24" 
                            value={pcCount} 
                            onChange={(e) => setPcCount(e.target.value)} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start">Start Time</Label>
                <Input id="start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end">End Time</Label>
                <Input id="end" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full h-12 text-lg font-bold bg-secondary hover:bg-secondary/90 text-white" onClick={handleFindRoom} disabled={loading}>
              {loading ? (
                <>Analyzing Room Availability...</>
              ) : (
                <>
                  Find Suitable Room <Sparkles className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* STEP 3: RECOMMENDATIONS */}
      {step === 3 && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Modify Requirements
            </Button>
            <Badge className="bg-secondary">AI Recommended</Badge>
          </div>

          <Alert className="bg-primary/5 border-primary/20">
            <Info className="w-4 h-4 text-primary" />
            <AlertTitle className="font-bold text-primary">System Recommendation</AlertTitle>
            <AlertDescription className="italic text-sm leading-relaxed">
              "{aiExplanation}"
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {recommendations.length === 0 ? (
              <Card className="p-12 text-center text-muted-foreground border-dashed">
                <p>No suitable rooms were found for these exact requirements. Try adjusting your needs.</p>
              </Card>
            ) : (
              recommendations.map((rec) => (
                <Card key={rec.id} className="border-none shadow-md overflow-hidden hover:shadow-lg transition-all group">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 bg-primary text-white p-6 flex flex-col justify-center items-center text-center">
                      <span className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Room No.</span>
                      <h3 className="text-3xl font-black">{rec.id.replace('CR', '').replace('TH-', '').replace('PE-', '').replace('CL', '')}</h3>
                      <p className="text-[10px] mt-2 bg-white/10 px-2 py-0.5 rounded uppercase font-bold">{rec.name}</p>
                    </div>
                    <CardContent className="flex-1 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg text-primary flex items-center gap-2">
                            {rec.name}
                            <Badge variant="outline" className="text-[10px] h-5">{category}</Badge>
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">Capacity: {rec.capacity} chairs</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                          <CheckCircle2 className="w-4 h-4" /> Why this room?
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{rec.suitabilityReason}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rec.equipment.map((eq: string) => (
                          <span key={eq} className="px-2 py-0.5 rounded bg-accent text-[10px] font-bold text-primary uppercase">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <div className="p-6 md:border-l border-dashed flex flex-col justify-center bg-accent/10">
                      <Button className="w-full md:w-auto font-bold group" onClick={() => handleBooking(rec)}>
                        Reserve Room
                        <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
