
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

export const WaterIntakeTracker = () => {
  const [currentIntake, setCurrentIntake] = useState(6);
  const [dailyGoal, setDailyGoal] = useState(8);

  const addWater = (amount: number) => {
    setCurrentIntake(prev => Math.max(0, prev + amount));
    if (amount > 0) {
      toast.success(`Added ${amount} glass${amount > 1 ? 'es' : ''} of water!`);
    }
  };

  const progressPercentage = (currentIntake / dailyGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Current Progress */}
      <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Daily Water Intake
          </CardTitle>
          <CardDescription className="text-blue-100">
            Stay hydrated throughout the day
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{currentIntake}</div>
                <div className="text-sm text-blue-100">glasses today</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{dailyGoal}</div>
                <div className="text-sm text-blue-100">daily goal</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-blue-200" />
            <div className="flex justify-between text-sm text-blue-100">
              <span>{Math.round(progressPercentage)}% completed</span>
              <span>{Math.max(0, dailyGoal - currentIntake)} glasses remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Easily track your water consumption
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { amount: 1, label: "1 Glass", size: "250ml" },
              { amount: 2, label: "2 Glasses", size: "500ml" },
              { amount: 3, label: "3 Glasses", size: "750ml" },
              { amount: 4, label: "1 Bottle", size: "1L" },
            ].map((option) => (
              <Button
                key={option.amount}
                variant="outline"
                onClick={() => addWater(option.amount)}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Plus className="h-4 w-4 mb-1" />
                <div className="text-sm font-semibold">{option.label}</div>
                <div className="text-xs text-muted-foreground">{option.size}</div>
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => addWater(-1)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Minus className="h-4 w-4" />
              Remove 1 Glass
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentIntake(0)}
              className="flex-1"
            >
              Reset Today
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hydration Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Hydration Schedule</CardTitle>
          <CardDescription>Suggested water intake throughout the day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "6:00 AM", activity: "Wake up", glasses: 1 },
              { time: "8:00 AM", activity: "Breakfast", glasses: 1 },
              { time: "10:00 AM", activity: "Mid-morning", glasses: 1 },
              { time: "12:00 PM", activity: "Lunch", glasses: 1 },
              { time: "3:00 PM", activity: "Afternoon", glasses: 1 },
              { time: "6:00 PM", activity: "Dinner", glasses: 1 },
              { time: "8:00 PM", activity: "Evening", glasses: 1 },
              { time: "10:00 PM", activity: "Before bed", glasses: 1 },
            ].map((schedule, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index < currentIntake ? "bg-blue-50 text-blue-700" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{schedule.time}</div>
                  <div className="text-sm text-muted-foreground">{schedule.activity}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  <span className="text-sm">{schedule.glasses} glass</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Hydration Benefits</CardTitle>
          <CardDescription>Why staying hydrated matters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">Improved Energy</h4>
              <p className="text-sm text-blue-600">Proper hydration boosts energy levels</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">Better Skin</h4>
              <p className="text-sm text-green-600">Hydration keeps skin healthy and glowing</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">Brain Function</h4>
              <p className="text-sm text-purple-600">Enhances focus and concentration</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-700 mb-2">Weight Management</h4>
              <p className="text-sm text-orange-600">Helps control appetite and metabolism</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
