import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import { useHealthData } from "@/hooks/useHealthData";

export const BloodPressureTracker = () => {
  const { addBPRecord, bpRecords } = useHealthData();
  const [newSystolic, setNewSystolic] = useState("");
  const [newDiastolic, setNewDiastolic] = useState("");

  const latestBP = bpRecords[0];
  const systolic = latestBP?.systolic || 120;
  const diastolic = latestBP?.diastolic || 80;

  const addReading = () => {
    if (newSystolic && newDiastolic) {
      addBPRecord.mutate({
        systolic: parseInt(newSystolic),
        diastolic: parseInt(newDiastolic),
      });
      setNewSystolic("");
      setNewDiastolic("");
    }
  };

  const getBPCategory = (sys: number, dia: number) => {
    if (sys < 120 && dia < 80) return { category: "Normal", color: "text-green-600", bgColor: "bg-green-50" };
    if (sys < 130 && dia < 80) return { category: "Elevated", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    if (sys < 140 || dia < 90) return { category: "Stage 1", color: "text-orange-600", bgColor: "bg-orange-50" };
    return { category: "Stage 2", color: "text-red-600", bgColor: "bg-red-50" };
  };

  const bpStatus = getBPCategory(systolic, diastolic);

  return (
    <div className="space-y-6">
      {/* Current Reading */}
      <Card className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Blood Pressure Monitor
          </CardTitle>
          <CardDescription className="text-red-100">
            Track your cardiovascular health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold">{systolic}/{diastolic}</div>
                <div className="text-sm text-red-100">mmHg</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{bpStatus.category}</div>
                <div className="text-sm text-red-100">blood pressure</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Reading */}
      <Card>
        <CardHeader>
          <CardTitle>Log Blood Pressure</CardTitle>
          <CardDescription>
            Record your blood pressure measurement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="systolic">Systolic (top number)</Label>
              <Input
                id="systolic"
                type="number"
                placeholder="120"
                value={newSystolic}
                onChange={(e) => setNewSystolic(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="diastolic">Diastolic (bottom number)</Label>
              <Input
                id="diastolic"
                type="number"
                placeholder="80"
                value={newDiastolic}
                onChange={(e) => setNewDiastolic(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={addReading} 
            className="w-full"
            disabled={addBPRecord.isPending}
          >
            {addBPRecord.isPending ? 'Logging...' : 'Log Reading'}
          </Button>
        </CardContent>
      </Card>

      {/* BP Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure Categories</CardTitle>
          <CardDescription>Understanding your readings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                category: "Normal", 
                systolic: "Less than 120", 
                diastolic: "Less than 80",
                color: "bg-green-50 text-green-700 border-green-200"
              },
              { 
                category: "Elevated", 
                systolic: "120-129", 
                diastolic: "Less than 80",
                color: "bg-yellow-50 text-yellow-700 border-yellow-200"
              },
              { 
                category: "High BP Stage 1", 
                systolic: "130-139", 
                diastolic: "80-89",
                color: "bg-orange-50 text-orange-700 border-orange-200"
              },
              { 
                category: "High BP Stage 2", 
                systolic: "140+", 
                diastolic: "90+",
                color: "bg-red-50 text-red-700 border-red-200"
              },
            ].map((item) => (
              <div key={item.category} className={`p-4 rounded-lg border ${item.color}`}>
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{item.category}</div>
                  <div className="text-sm">
                    {item.systolic} / {item.diastolic}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Health Tips</CardTitle>
          <CardDescription>Ways to maintain healthy blood pressure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">Exercise Regularly</h4>
              <p className="text-sm text-blue-600">30 minutes of moderate activity most days</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">Eat Healthy</h4>
              <p className="text-sm text-green-600">Reduce sodium, increase fruits and vegetables</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-700 mb-2">Manage Stress</h4>
              <p className="text-sm text-purple-600">Practice relaxation techniques</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-700 mb-2">Limit Alcohol</h4>
              <p className="text-sm text-orange-600">Moderate consumption or avoid</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
