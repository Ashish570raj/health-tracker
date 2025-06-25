
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Activity, AlertTriangle, CheckCircle } from "lucide-react";
import { HealthChart } from "./HealthChart";
import { toast } from "sonner";

export const HeartRateTracker = () => {
  const [currentHeartRate, setCurrentHeartRate] = useState(72);
  const [newHeartRate, setNewHeartRate] = useState("");

  const addHeartRate = () => {
    if (newHeartRate) {
      const rate = parseInt(newHeartRate);
      setCurrentHeartRate(rate);
      setNewHeartRate("");
      toast.success("Heart rate logged successfully!");
    }
  };

  const getHeartRateStatus = (rate: number) => {
    if (rate < 60) return { status: "Low", color: "text-blue-600", icon: Activity };
    if (rate > 100) return { status: "High", color: "text-red-600", icon: AlertTriangle };
    return { status: "Normal", color: "text-green-600", icon: CheckCircle };
  };

  const heartRateStatus = getHeartRateStatus(currentHeartRate);
  const StatusIcon = heartRateStatus.icon;

  return (
    <div className="space-y-6">
      {/* Current Heart Rate */}
      <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Heart Rate Monitor
          </CardTitle>
          <CardDescription className="text-red-100">
            Keep track of your cardiovascular health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{currentHeartRate}</div>
                <div className="text-sm text-red-100">beats per minute</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">{heartRateStatus.status}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Heart Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Log Heart Rate</CardTitle>
          <CardDescription>
            Manually record your heart rate measurement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="newHeartRate">Heart Rate (BPM)</Label>
            <Input
              id="newHeartRate"
              type="number"
              placeholder="Enter heart rate..."
              value={newHeartRate}
              onChange={(e) => setNewHeartRate(e.target.value)}
            />
          </div>
          <Button onClick={addHeartRate} className="w-full">
            Log Heart Rate
          </Button>
        </CardContent>
      </Card>

      {/* Heart Rate Zones */}
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate Zones</CardTitle>
          <CardDescription>Understanding your target zones for different activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { zone: "Resting", range: "< 60", color: "bg-blue-100 text-blue-700", description: "Very light activity" },
              { zone: "Fat Burn", range: "60-70%", color: "bg-green-100 text-green-700", description: "Light exercise" },
              { zone: "Cardio", range: "70-85%", color: "bg-yellow-100 text-yellow-700", description: "Moderate exercise" },
              { zone: "Peak", range: "85-95%", color: "bg-red-100 text-red-700", description: "High intensity" },
            ].map((zone) => (
              <div key={zone.zone} className={`p-4 rounded-lg ${zone.color}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{zone.zone} Zone</div>
                    <div className="text-sm">{zone.description}</div>
                  </div>
                  <div className="text-lg font-bold">{zone.range}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Heart Rate Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate Trends</CardTitle>
          <CardDescription>Your heart rate over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthChart type="heartRate" />
        </CardContent>
      </Card>
    </div>
  );
};
