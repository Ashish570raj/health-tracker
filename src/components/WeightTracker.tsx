
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Weight, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { HealthChart } from "./HealthChart";
import { toast } from "sonner";

export const WeightTracker = () => {
  const [currentWeight, setCurrentWeight] = useState(72.5);
  const [targetWeight, setTargetWeight] = useState(70);
  const [newWeight, setNewWeight] = useState("");

  const addWeight = () => {
    if (newWeight) {
      const weight = parseFloat(newWeight);
      setCurrentWeight(weight);
      setNewWeight("");
      toast.success("Weight logged successfully!");
    }
  };

  const weightDifference = currentWeight - targetWeight;
  const isAboveTarget = weightDifference > 0;

  return (
    <div className="space-y-6">
      {/* Current Weight Status */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Weight className="h-5 w-5" />
            Weight Progress
          </CardTitle>
          <CardDescription className="text-purple-100">
            Track your weight journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{currentWeight} kg</div>
                <div className="text-sm text-purple-100">current weight</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{targetWeight} kg</div>
                <div className="text-sm text-purple-100">target weight</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAboveTarget ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm">
                {Math.abs(weightDifference).toFixed(1)} kg {isAboveTarget ? 'above' : 'below'} target
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Weight & Set Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Log Weight</CardTitle>
            <CardDescription>
              Record your current weight measurement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newWeight">Weight (kg)</Label>
              <Input
                id="newWeight"
                type="number"
                step="0.1"
                placeholder="Enter weight..."
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
              />
            </div>
            <Button onClick={addWeight} className="w-full">
              Log Weight
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Set Target</CardTitle>
            <CardDescription>
              Define your weight goal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetWeight">Target Weight (kg)</Label>
              <Input
                id="targetWeight"
                type="number"
                step="0.1"
                placeholder="Enter target..."
                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 70)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Current target: {targetWeight} kg
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weight Trend</CardTitle>
          <CardDescription>Your weight progress over time</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthChart type="weight" />
        </CardContent>
      </Card>

      {/* BMI Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Health Metrics</CardTitle>
          <CardDescription>Based on your current weight</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">BMI</div>
              <div className="text-2xl font-bold">22.4</div>
              <div className="text-sm text-muted-foreground">Normal</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">Body Fat</div>
              <div className="text-2xl font-bold">15%</div>
              <div className="text-sm text-muted-foreground">Estimated</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-700">Ideal Range</div>
              <div className="text-2xl font-bold">65-75</div>
              <div className="text-sm text-muted-foreground">kg</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
