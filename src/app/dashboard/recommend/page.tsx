
"use client"

import { useState } from 'react';
import { recommendFacility, type RecommendFacilityOutput } from '@/ai/flows/recommend-facility';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Sparkles, Send, BrainCircuit, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AIRecommendationPage() {
  const [request, setRequest] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RecommendFacilityOutput | null>(null);

  const handleAskAI = async () => {
    if (!request.trim()) return;
    setLoading(true);
    try {
      const response = await recommendFacility({ userRequest: request });
      setResults(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary">Smart Assistant</h1>
          <p className="text-muted-foreground">Tell the AI what you need, and it will find the best space for you.</p>
        </div>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Textarea 
                placeholder="Ex: I need a room for 40 people tomorrow afternoon with a projector and a large whiteboard for a coding workshop."
                className="min-h-[120px] text-lg bg-accent/20 border-none focus-visible:ring-secondary resize-none"
                value={request}
                onChange={(e) => setRequest(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BrainCircuit className="w-4 h-4" />
                  Powered by Gemini 2.5 Flash
                </div>
                <Button 
                  onClick={handleAskAI} 
                  disabled={loading || !request.trim()}
                  className="bg-secondary text-white hover:bg-secondary/90 h-11 px-8 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
                >
                  {loading ? 'Analyzing...' : 'Find the Perfect Space'}
                  {!loading && <Send className="ml-2 w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <Alert className="bg-secondary/5 border-secondary/20">
              <Info className="w-4 h-4 text-secondary" />
              <AlertTitle className="text-secondary font-bold">AI Analysis</AlertTitle>
              <AlertDescription className="text-sm text-secondary-foreground leading-relaxed italic">
                "{results.aiExplanation}"
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {results.recommendations.map((rec, i) => (
                <Card key={rec.id} className="border-none shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 bg-primary/5 p-6 flex flex-col justify-center items-center text-center border-r border-dashed">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold shadow-sm mb-2">
                        {i + 1}
                      </div>
                      <h3 className="font-bold text-primary">{rec.name}</h3>
                      <p className="text-xs text-muted-foreground">Capacity: {rec.capacity}</p>
                    </div>
                    <CardContent className="flex-1 p-6 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-secondary" />
                          <span className="text-sm font-semibold">Why this works?</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{rec.suitabilityReason}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rec.equipment.map(eq => (
                          <span key={eq} className="px-2 py-1 rounded-md bg-accent text-[10px] font-bold text-primary uppercase">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 md:w-auto flex items-center justify-center">
                      <Button variant="outline" className="w-full md:w-auto border-secondary text-secondary hover:bg-secondary hover:text-white">
                        Book Now
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
