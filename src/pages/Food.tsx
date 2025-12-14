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
import { Utensils, Leaf, Calendar, Lightbulb } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { FoodInput, FoodOutput, AlternativeSuggestion, ActivityHistory } from '@/types';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

const Food: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState<FoodInput>({
    category: 'vegetarian',
    foodType: 'rice',
    quantity: 'medium',
    mealsPerDay: 3,
  });
  const [output, setOutput] = useState<FoodOutput | null>(null);
  const [suggestion, setSuggestion] = useState<AlternativeSuggestion | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    if (!user) {
      toast.error('Please log in to track food intake');
      return;
    }

    const result = calculationService.calculateFood(input);
    setOutput(result);
    setShowResults(true);

    const alt = calculationService.generateFoodSuggestion(input, result);
    setSuggestion(alt);

    const activity: ActivityHistory = {
      id: crypto.randomUUID(),
      userId: user.id,
      activityType: 'food' as const,
      activityDate: new Date().toISOString().split('T')[0],
      activityTime: new Date().toISOString().split('T')[1].split('.')[0],
      inputData: { ...input } as unknown as Record<string, unknown>,
      carbonEmitted: result.dailyEmission,
      costSpent: 0,
      alternativeApplied: false,
      createdAt: new Date().toISOString(),
    };

    storageService.addActivity(activity);
    toast.success('Food intake tracked successfully!');
  };

  const handleApplySuggestion = () => {
    if (!suggestion || !user) return;

    const newCategory = input.category === 'non_vegetarian' ? 'vegetarian' : 'vegan';
    const newInput = { ...input, category: newCategory as FoodInput['category'] };
    const result = calculationService.calculateFood(newInput);

    setInput(newInput);
    setOutput(result);
    setSuggestion(null);

    const activity: ActivityHistory = {
      id: crypto.randomUUID(),
      userId: user.id,
      activityType: 'food' as const,
      activityDate: new Date().toISOString().split('T')[0],
      activityTime: new Date().toISOString().split('T')[1].split('.')[0],
      inputData: { ...newInput } as unknown as Record<string, unknown>,
      carbonEmitted: result.dailyEmission,
      costSpent: 0,
      alternativeApplied: true,
      createdAt: new Date().toISOString(),
    };

    storageService.addActivity(activity);
    toast.success('Suggestion applied! Greener diet tracked.');
  };

  const chartData = output
    ? [
        { name: 'Daily', value: output.dailyEmission },
        { name: 'Weekly', value: output.weeklyEmission },
        { name: 'Monthly', value: output.monthlyEmission },
      ]
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Utensils className="w-8 h-8 mr-3 text-secondary" />
            Food Intake Tracking
          </h1>
          <p className="text-muted-foreground">
            Monitor your food carbon footprint
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Food Details</CardTitle>
              <CardDescription>Enter your meal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Food Category</Label>
                <Select
                  value={input.category}
                  onValueChange={(value: FoodInput['category']) =>
                    setInput({ ...input, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foodType">Food Type</Label>
                <Select
                  value={input.foodType}
                  onValueChange={(value: FoodInput['foodType']) =>
                    setInput({ ...input, foodType: value })
                  }
                >
                  <SelectTrigger id="foodType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="wheat">Wheat</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="meat">Meat</SelectItem>
                    <SelectItem value="processed">Processed Foods</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Select
                  value={input.quantity}
                  onValueChange={(value: FoodInput['quantity']) =>
                    setInput({ ...input, quantity: value })
                  }
                >
                  <SelectTrigger id="quantity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealsPerDay">Meals Per Day</Label>
                <Input
                  id="mealsPerDay"
                  type="number"
                  min="1"
                  max="6"
                  value={input.mealsPerDay}
                  onChange={(e) => setInput({ ...input, mealsPerDay: Number(e.target.value) })}
                />
              </div>

              <Button onClick={handleCalculate} className="w-full">
                Calculate Emissions
              </Button>
            </CardContent>
          </Card>

          {showResults && output && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Emissions</CardTitle>
                  <CardDescription>Your food carbon footprint</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Leaf className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Daily Emission</p>
                        <p className="text-2xl font-bold text-primary">{output.dailyEmission} kg CO₂</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-secondary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Weekly Emission</p>
                        <p className="text-2xl font-bold text-secondary">{output.weeklyEmission} kg CO₂</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-6 h-6 text-chart-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Emission</p>
                        <p className="text-2xl font-bold">{output.monthlyEmission} kg CO₂</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value.toFixed(1)} kg`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
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
                    <CardDescription>Reduce your food carbon footprint</CardDescription>
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
                        Save {suggestion.carbonSaved} kg CO₂ per day ({suggestion.percentageImprovement.toFixed(1)}% reduction)
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

export default Food;
