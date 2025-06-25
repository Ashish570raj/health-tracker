import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, Heart, Weight, Moon, User, Bell } from "lucide-react";
import { HealthChart } from "./HealthChart";

const mockData = {
  steps: { current: 8432, goal: 10000 },
  weight: { current: 72.5, change: -0.3 },
  heartRate: { current: 72, status: "normal" },
  sleep: { current: 7.5, goal: 8 },
  water: { current: 6, goal: 8 },
  bloodPressure: { systolic: 120, diastolic: 80 }
};

export const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Steps</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.steps.current.toLocaleString()}</div>
            <Progress 
              value={(mockData.steps.current / mockData.steps.goal) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {mockData.steps.goal - mockData.steps.current} steps to goal
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.heartRate.current} bpm</div>
            <p className="text-xs text-green-600 mt-1">
              {mockData.heartRate.status}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weight</CardTitle>
            <Weight className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.weight.current} kg</div>
            <p className="text-xs text-green-600 mt-1">
              {mockData.weight.change > 0 ? '+' : ''}{mockData.weight.change} kg this week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep</CardTitle>
            <Moon className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.sleep.current}h</div>
            <Progress 
              value={(mockData.sleep.current / mockData.sleep.goal) * 100} 
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {mockData.sleep.goal - mockData.sleep.current}h to goal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your daily steps over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthChart type="steps" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Heart Rate Trends</CardTitle>
            <CardDescription>Average heart rate over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <HealthChart type="heartRate" />
          </CardContent>
        </Card>
      </div>

      {/* Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Health Summary</CardTitle>
          <CardDescription>Quick overview of all your health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-700">Water</div>
              <div className="text-2xl font-bold">{mockData.water.current}/{mockData.water.goal}</div>
              <div className="text-sm text-muted-foreground">glasses</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-lg font-semibold text-red-700">Blood Pressure</div>
              <div className="text-2xl font-bold">{mockData.bloodPressure.systolic}/{mockData.bloodPressure.diastolic}</div>
              <div className="text-sm text-muted-foreground">mmHg</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-lg font-semibold text-green-700">BMI</div>
              <div className="text-2xl font-bold">22.4</div>
              <div className="text-sm text-muted-foreground">Normal</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-700">Calories</div>
              <div className="text-2xl font-bold">2,150</div>
              <div className="text-sm text-muted-foreground">burned</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
