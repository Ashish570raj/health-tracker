
import { useAuth } from "@/hooks/useAuth";
import { AuthForm } from "@/components/AuthForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardOverview } from "@/components/DashboardOverview";
import { StepsTracker } from "@/components/StepsTracker";
import { WeightTracker } from "@/components/WeightTracker";
import { HeartRateTracker } from "@/components/HeartRateTracker";
import { BloodPressureTracker } from "@/components/BloodPressureTracker";
import { WaterIntakeTracker } from "@/components/WaterIntakeTracker";
import { SleepTracker } from "@/components/SleepTracker";
import { User, LogOut } from "lucide-react";

const Index = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            HealthTracker
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Health Dashboard</h2>
          <p className="text-muted-foreground">Track your wellness journey and achieve your health goals</p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="steps">Steps</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="heart">Heart Rate</TabsTrigger>
            <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
            <TabsTrigger value="water">Water</TabsTrigger>
            <TabsTrigger value="sleep">Sleep</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="animate-fade-in">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="steps" className="animate-fade-in">
            <StepsTracker />
          </TabsContent>

          <TabsContent value="weight" className="animate-fade-in">
            <WeightTracker />
          </TabsContent>

          <TabsContent value="heart" className="animate-fade-in">
            <HeartRateTracker />
          </TabsContent>

          <TabsContent value="bp" className="animate-fade-in">
            <BloodPressureTracker />
          </TabsContent>

          <TabsContent value="water" className="animate-fade-in">
            <WaterIntakeTracker />
          </TabsContent>

          <TabsContent value="sleep" className="animate-fade-in">
            <SleepTracker />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
