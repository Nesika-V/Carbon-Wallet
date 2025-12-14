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
import { Activity, Flame, TrendingDown, Leaf, Lightbulb } from 'lucide-react';
import type { ExerciseInput, ExerciseOutput, AlternativeSuggestion, ActivityHistory } from '@/types';

const Exercise: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState<ExerciseInput>({
    type: 'walking',
    duration: 30,
    intensity: 'moderate',
    frequency: 3,
  });
  const [output, setOutput] = useState<ExerciseOutput | null>(null);
  const [suggestion, setSuggestion] = useState<AlternativeSuggestion | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    if (!user) {
      toast.error('Please log in to track exercise');
      return;
    }

    const profile = storageService.getProfile(user.id);
    const result = calculationService.calculateExercise(input, profile);
    setOutput(result);
    setShowResults(true);

    const alt = calculationService.generateExerciseSuggestion(input, result);
    setSuggestion(alt);

    const activity: ActivityHistory = {
      id: crypto.randomUUID(),
      userId: user.id,
      activityType: 'exercise' as const,
      activityDate: new Date().toISOString().split('T')[0],
      activityTime: new Date().toISOString().split('T')[1].split('.')[0],
      inputData: { ...input } as unknown as Record<string, unknown>,
      carbonEmitted: result.carbonImpact,
      costSpent: 0,
      duration: input.duration,
      alternativeApplied: false,
      createdAt: new Date().toISOString(),
    };

    storageService.addActivity(activity);
    toast.success('Exercise tracked successfully!');
  };

  const handleApplySuggestion = () => {
    if (!suggestion || !user) return;

    const newIntensity = input.intensity === 'low' ? 'moderate' : 'high';
    const newInput = { ...input, intensity: newIntensity as ExerciseInput['intensity'] };
    const profile = storageService.getProfile(user.id);
    const result = calculationService.calculateExercise(newInput, profile);

    setInput(newInput);
    setOutput(result);
    setSuggestion(null);

    const activity: ActivityHistory = {
      id: crypto.randomUUID(),
      userId: user.id,
      activityType: 'exercise' as const,
      activityDate: new Date().toISOString().split('T')[0],
      activityTime: new Date().toISOString().split('T')[1].split('.')[0],
      inputData: { ...newInput } as unknown as Record<string, unknown>,
      carbonEmitted: result.carbonImpact,
      costSpent: 0,
      duration: newInput.duration,
      alternativeApplied: true,
      createdAt: new Date().toISOString(),
    };

    storageService.addActivity(activity);
    toast.success('Suggestion applied! Higher intensity workout tracked.');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Activity className="w-8 h-8 mr-3 text-primary" />
            Exercise Tracking
          </h1>
          <p className="text-muted-foreground">
            Track your workouts and see how much you're burning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Details</CardTitle>
              <CardDescription>Enter your workout information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Exercise Type</Label>
                <Select
                  value={input.type}
                  onValueChange={(value: ExerciseInput['type']) =>
                    setInput({ ...input, type: value })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="300"
                  value={input.duration}
                  onChange={(e) => setInput({ ...input, duration: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intensity">Intensity Level</Label>
                <Select
                  value={input.intensity}
                  onValueChange={(value: ExerciseInput['intensity']) =>
                    setInput({ ...input, intensity: value })
                  }
                >
                  <SelectTrigger id="intensity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency (days per week)</Label>
                <Input
                  id="frequency"
                  type="number"
                  min="1"
                  max="7"
                  value={input.frequency}
                  onChange={(e) => setInput({ ...input, frequency: Number(e.target.value) })}
                />
              </div>

              <Button onClick={handleCalculate} className="w-full">
                Calculate Results
              </Button>
            </CardContent>
          </Card>

          {showResults && output && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Results</CardTitle>
                  <CardDescription>Based on your workout details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Flame className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Calories Burned</p>
                        <p className="text-2xl font-bold text-primary">{output.caloriesBurned}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingDown className="w-6 h-6 text-secondary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Weight Change</p>
                        <p className="text-2xl font-bold text-secondary">{output.weightChange} kg</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Leaf className="w-6 h-6 text-chart-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Carbon Impact</p>
                        <p className="text-2xl font-bold">{output.carbonImpact} kg CO₂</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {suggestion && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                      Suggestion
                    </CardTitle>
                    <CardDescription>Increase your workout intensity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <p className="text-sm mb-2">
                        <span className="font-medium">Current:</span> {suggestion.currentChoice}
                      </p>
                      <p className="text-sm mb-2">
                        <span className="font-medium">Suggested:</span> {suggestion.alternative}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        +{suggestion.percentageImprovement.toFixed(1)}% more calories burned
                      </p>
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

export default Exercise;
