
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Moon, Sun, Clock, Activity } from "lucide-react";
import { HealthChart } from "./HealthChart";
import { toast } from "sonner";

export const SleepTracker = () => {
  const [sleepHours, setSleepHours] = useState(7.5);
  const [sleepGoal, setSleepGoal] = useState(8);
  const [bedtime, setBedtime] = useState("22:30");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [newSleepHours, setNewSleepHours] = useState("");

  const addSleep = () => {
    if (newSleepHours) {
      const hours = parseFloat(newSleepHours);
      setSleepHours(hours);
      setNewSleepHours("");
      toast.success("Sleep logged successfully!");
    }
  };

  const progressPercentage = (sleepHours / sleepGoal) * 100;

  const getSleepQuality = (hours: number) => {
    if (hours >= 7 && hours <= 9) return { quality: "Good", color: "text-green-600" };
    if (hours >= 6 && hours < 7) return { quality: "Fair", color: "text-yellow-600" };
    return { quality: "Poor", color: "text-red-600" };
  };

  const sleepQuality = getSleepQuality(sleepHours);

  return (
    <div className="space-y-6">
      {/* Current Sleep Status */}
      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Sleep Tracker
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Monitor your sleep patterns for better rest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{sleepHours}h</div>
                <div className="text-sm text-indigo-100">last night</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{sleepGoal}h</div>
                <div className="text-sm text-indigo-100">daily goal</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3 bg-indigo-200" />
            <div className="flex justify-between text-sm text-indigo-100">
              <span className={sleepQuality.color}>Sleep Quality: {sleepQuality.quality}</span>
              <span>{Math.max(0, sleepGoal - sleepHours).toFixed(1)}h to goal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Sleep & Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Log Sleep</CardTitle>
            <CardDescription>
              Record your sleep duration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="newSleepHours">Sleep Duration (hours)</Label>
              <Input
                id="newSleepHours"
                type="number"
                step="0.5"
                placeholder="Enter sleep hours..."
                value={newSleepHours}
                onChange={(e) => setNewSleepHours(e.target.value)}
              />
            </div>
            <Button onClick={addSleep} className="w-full">
              Log Sleep
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep Schedule</CardTitle>
            <CardDescription>
              Set your ideal sleep and wake times
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bedtime">Bedtime</Label>
              <Input
                id="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="wakeTime">Wake Time</Label>
              <Input
                id="wakeTime"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sleep Patterns</CardTitle>
          <CardDescription>Your sleep duration over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthChart type="sleep" />
        </CardContent>
      </Card>

      {/* Sleep Phases & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sleep Phases</CardTitle>
            <CardDescription>Understanding your sleep cycle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { phase: "Light Sleep", duration: "2-3h", color: "bg-blue-50 text-blue-700" },
                { phase: "Deep Sleep", duration: "1-2h", color: "bg-indigo-50 text-indigo-700" },
                { phase: "REM Sleep", duration: "1.5-2h", color: "bg-purple-50 text-purple-700" },
                { phase: "Awake", duration: "< 30min", color: "bg-gray-50 text-gray-700" },
              ].map((phase) => (
                <div key={phase.phase} className={`p-3 rounded-lg ${phase.color}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{phase.phase}</span>
                    <span className="text-sm">{phase.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sleep Tips</CardTitle>
            <CardDescription>Improve your sleep quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { tip: "Consistent Schedule", icon: Clock },
                { tip: "Cool Environment", icon: Moon },
                { tip: "Avoid Screens", icon: Sun },
                { tip: "Regular Exercise", icon: Activity },
              ].map((item) => (
                <div key={item.tip} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <item.icon className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium">{item.tip}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
