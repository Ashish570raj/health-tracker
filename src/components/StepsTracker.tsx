
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Activity, Plus, Target } from "lucide-react";
import { HealthChart } from "./HealthChart";
import { useHealthData } from "@/hooks/useHealthData";

export const StepsTracker = () => {
  const { addHealthRecord, updateGoal, getLatestRecord, getGoalForMetric } = useHealthData();
  const [newSteps, setNewSteps] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const latestSteps = getLatestRecord('steps');
  const stepsGoal = getGoalForMetric('steps');
  
  const currentSteps = latestSteps?.value || 0;
  const dailyGoal = stepsGoal?.target_value || 10000;

  const addSteps = () => {
    if (newSteps) {
      const steps = parseInt(newSteps);
      const newTotal = currentSteps + steps;
      
      addHealthRecord.mutate({
        metric_type: 'steps',
        value: newTotal,
        unit: 'steps',
      });
      
      setNewSteps("");
    }
  };

  const handleUpdateGoal = () => {
    if (newGoal) {
      updateGoal.mutate({
        metric_type: 'steps',
        target_value: parseInt(newGoal),
      });
      setNewGoal("");
    }
  };

  const progressPercentage = (currentSteps / dailyGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Current Progress */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Daily Steps Progress
          </CardTitle>
          <CardDescription className="text-blue-100">
            Keep moving towards your daily goal!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{Math.round(currentSteps).toLocaleString()}</div>
                <div className="text-sm text-blue-100">steps today</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{dailyGoal.toLocaleString()}</div>
                <div className="text-sm text-blue-100">daily goal</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-blue-200" />
            <div className="flex justify-between text-sm text-blue-100">
              <span>{Math.round(progressPercentage)}% completed</span>
              <span>{Math.max(0, dailyGoal - currentSteps).toLocaleString()} steps remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Steps & Update Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Steps
            </CardTitle>
            <CardDescription>
              Manually add steps from other activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newSteps">Number of Steps</Label>
              <Input
                id="newSteps"
                type="number"
                placeholder="Enter steps..."
                value={newSteps}
                onChange={(e) => setNewSteps(e.target.value)}
              />
            </div>
            <Button 
              onClick={addSteps} 
              className="w-full"
              disabled={addHealthRecord.isPending}
            >
              {addHealthRecord.isPending ? 'Adding...' : 'Add Steps'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Daily Goal
            </CardTitle>
            <CardDescription>
              Adjust your daily step target
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goal">Daily Step Goal</Label>
              <Input
                id="goal"
                type="number"
                placeholder="Enter goal..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleUpdateGoal} 
              className="w-full"
              disabled={updateGoal.isPending}
            >
              {updateGoal.isPending ? 'Updating...' : 'Update Goal'}
            </Button>
            <div className="text-sm text-muted-foreground">
              Current goal: {dailyGoal.toLocaleString()} steps
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Step Activity</CardTitle>
          <CardDescription>Your step count over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthChart type="steps" />
        </CardContent>
      </Card>

      {/* Step Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Step Milestones</CardTitle>
          <CardDescription>Track your achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { milestone: 5000, label: "Active", achieved: currentSteps >= 5000 },
              { milestone: 7500, label: "Brisk", achieved: currentSteps >= 7500 },
              { milestone: 10000, label: "Goal", achieved: currentSteps >= 10000 },
              { milestone: 12500, label: "Superb", achieved: currentSteps >= 12500 },
            ].map((item) => (
              <div
                key={item.milestone}
                className={`p-4 rounded-lg text-center transition-colors ${
                  item.achieved 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-50 text-gray-500"
                }`}
              >
                <div className="font-semibold">{item.label}</div>
                <div className="text-sm">{item.milestone.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
