import { Shield, Award, Clock, Users, CheckCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TrustBarProps {
  variant?: 'default' | 'compact';
  className?: string;
}

const TrustBar = ({ variant = 'default', className = '' }: TrustBarProps) => {
  const trustPoints = [
    {
      icon: Shield,
      title: "Buyer Protection",
      description: "100% money-back guarantee on verified listings",
      stat: "$2M+ Protected"
    },
    {
      icon: Award,
      title: "Verified SME Sellers",
      description: "All sellers undergo business verification",
      stat: "500+ Verified"
    },
    {
      icon: Clock,
      title: "48hr Dispute Resolution",
      description: "Fast, fair resolution for any issues",
      stat: "99% Resolved"
    },
    {
      icon: Users,
      title: "Local Business Network",
      description: "Connect with businesses in your area",
      stat: "10K+ Members"
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-y ${className}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {trustPoints.map((point, index) => {
              const Icon = point.icon;
              return (
                <div key={index} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-700">{point.title}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{point.stat}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-12 bg-gradient-to-b from-gray-50 to-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Why B2B Buyers Trust Our Platform
          </h2>
          <p className="text-gray-600">
            Join thousands of verified businesses trading surplus equipment safely
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-gray-200">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{point.title}</h3>
                  <p className="text-sm text-gray-600">{point.description}</p>
                  <div className="pt-2 border-t w-full">
                    <span className="text-lg font-bold text-blue-600">{point.stat}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800">
              <strong>Escrow Protection:</strong> Funds held securely until you confirm receipt of goods
            </p>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;