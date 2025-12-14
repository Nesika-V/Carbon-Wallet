import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { calculationService } from '@/services/calculations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Car, Leaf, DollarSign, TrendingUp, Lightbulb } from 'lucide-react';
import type { TravelInput, TravelOutput, AlternativeSuggestion, ActivityHistory } from '@/types';

const Travel: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState<TravelInput>({
    mode: 'car',
    distance: 10,
    fuelType: 'petrol',
    vehicleAge: 3,
    mileage: 'medium',
  });
  const [output, setOutput] = useState<TravelOutput | null>(null);
  const [suggestion, setSuggestion] = useState<AlternativeSuggestion | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    if (!user) {
      toast.error('Please log in to track travel');
      return;
    }

    if (input.distance <= 0) {
      toast.error('Please enter a valid distance');
      return;
    }

    const result = calculationService.calculateTravel(input);
    setOutput(result);
    setShowResults(true);

    const alt = calculationService.generateTravelSuggestion(input, result);
    setSuggestion(alt);

    const activity: ActivityHistory = {
      id: crypto.randomUUID(),
      userId: user.id,
      activityType: 'manual_travel' as const,
      activityDate: new Date().toISOString().split('T')[0],
      activityTime: new Date().toISOString().split('T')[1].split('.')[0],
      inputData: { ...input } as unknown as Record<string, unknown>,
      carbonEmitted: result.carbonEmitted,
      costSpent: result.moneySpent,
      distanceTravelled: input.distance,
      alternativeApplied: false,
      createdAt: new Date().toISOString(),
    };

    storageService.addActivity(activity);
    toast.success('Travel tracked successfully!');
  };

  const handleApplySuggestion = () => {
    if (!suggestion || !user) return;

    let alternative: TravelInput['mode'] = 'public_transport';
    if (input.distance < 5) {
      alternative = 'walk';
    }

    const newInput = {
      ...input,
      mode: alternative,
      fuelType: alternative === 'walk' ? 'none' as const : input.fuelType,
    };
    const result = calculationService.calculateTravel(newInput);

    setInput(newInput);
    setOutput(result);
    setSuggestion(null);

    const activity: ActivityHistory = {
      id: crypto.randomUUID(),
      userId: user.id,
      activityType: 'manual_travel' as const,
      activityDate: new Date().toISOString().split('T')[0],
      activityTime: new Date().toISOString().split('T')[1].split('.')[0],
      inputData: { ...newInput } as unknown as Record<string, unknown>,
      carbonEmitted: result.carbonEmitted,
      costSpent: result.moneySpent,
      distanceTravelled: newInput.distance,
      alternativeApplied: true,
      createdAt: new Date().toISOString(),
    };

    storageService.addActivity(activity);
    toast.success('Suggestion applied! Greener travel option tracked.');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Car className="w-8 h-8 mr-3 text-chart-3" />
            Manual Travel Tracking
          </h1>
          <p className="text-muted-foreground">
            Log your travel emissions and costs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Travel Details</CardTitle>
              <CardDescription>Enter your journey information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mode">Mode of Travel</Label>
                <Select
                  value={input.mode}
                  onValueChange={(value: TravelInput['mode']) =>
                    setInput({ ...input, mode: value })
                  }
                >
                  <SelectTrigger id="mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike/Motorcycle</SelectItem>
                    <SelectItem value="public_transport">Public Transport</SelectItem>
                    <SelectItem value="train">Train</SelectItem>
                    <SelectItem value="walk">Walk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={input.distance}
                  onChange={(e) => setInput({ ...input, distance: Number(e.target.value) })}
                />
              </div>

              {input.mode !== 'walk' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select
                      value={input.fuelType}
                      onValueChange={(value: TravelInput['fuelType']) =>
                        setInput({ ...input, fuelType: value })
                      }
                    >
                      <SelectTrigger id="fuelType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {input.fuelType !== 'none' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleAge">Vehicle Age (years)</Label>
                        <Input
                          id="vehicleAge"
                          type="number"
                          min="0"
                          max="30"
                          value={input.vehicleAge || 0}
                          onChange={(e) => setInput({ ...input, vehicleAge: Number(e.target.value) })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mileage">Mileage Range</Label>
                        <Select
                          value={input.mileage || 'medium'}
                          onValueChange={(value: TravelInput['mileage']) =>
                            setInput({ ...input, mileage: value })
                          }
                        >
                          <SelectTrigger id="mileage">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low (5-10 km/l)</SelectItem>
                            <SelectItem value="medium">Medium (10-15 km/l)</SelectItem>
                            <SelectItem value="high">High (15+ km/l)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </>
              )}

              <Button onClick={handleCalculate} className="w-full">
                Calculate Impact
              </Button>
            </CardContent>
          </Card>

          {showResults && output && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Summary</CardTitle>
                  <CardDescription>Your travel impact</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Leaf className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Carbon Emitted</p>
                        <p className="text-2xl font-bold text-primary">{output.carbonEmitted} kg CO₂</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-6 h-6 text-secondary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Money Spent</p>
                        <p className="text-2xl font-bold text-secondary">${output.moneySpent}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-chart-3" />
                        <p className="text-xs text-muted-foreground">Cost/km</p>
                      </div>
                      <p className="text-lg font-bold">${output.costPerKm}</p>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Leaf className="w-4 h-4 text-chart-1" />
                        <p className="text-xs text-muted-foreground">Emission/km</p>
                      </div>
                      <p className="text-lg font-bold">{output.emissionPerKm} kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {suggestion && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                      Greener Alternative
                    </CardTitle>
                    <CardDescription>Reduce your travel impact</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="text-sm mb-2">
                        <span className="font-medium">Current:</span> {suggestion.currentChoice}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Suggested:</span> {suggestion.alternative}
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-primary font-medium">
                          Save {suggestion.carbonSaved} kg CO₂ ({suggestion.percentageImprovement.toFixed(1)}% reduction)
                        </p>
                        {suggestion.costSaved > 0 && (
                          <p className="text-sm text-secondary font-medium">
                            Save ${suggestion.costSaved}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button onClick={handleApplySuggestion} className="w-full">
                      Apply Suggestion
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Travel;
