import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Alerts = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Alerts | ZingLots</title>
        <meta name="description" content="Create alerts to get notified when new lots match your interests." />
      </Helmet>

      <ModernNav />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Set Up Alerts</h1>
        <p className="text-gray-600 mb-8">Receive notifications when new lots match your search or categories.</p>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input type="text" className="w-full border rounded-md p-2" placeholder="e.g., pizza oven, cedar lumber" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location (optional)</label>
                <input type="text" className="w-full border rounded-md p-2" placeholder="e.g., Seattle, WA" />
              </div>
              <div className="flex gap-2">
                <Button className="btn-modern btn-primary">Create Alert</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Alerts;

