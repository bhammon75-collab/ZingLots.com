import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield,
  Lock,
  Key,
  Eye,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Server,
  Smartphone,
  UserCheck,
  FileKey,
  Globe,
  Activity
} from "lucide-react";

const Security = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: "256-bit SSL Encryption",
      description: "All data transmitted between your browser and our servers is encrypted using industry-standard SSL/TLS protocols.",
      badge: "Always Active"
    },
    {
      icon: CreditCard,
      title: "PCI DSS Compliant",
      description: "We meet the highest standards for payment card security, ensuring your financial information is protected.",
      badge: "Level 1"
    },
    {
      icon: ShieldCheck,
      title: "Two-Factor Authentication",
      description: "Optional 2FA adds an extra layer of security to your account using SMS or authenticator apps.",
      badge: "Available"
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Hosted on enterprise-grade servers with redundant backups and 99.9% uptime guarantee.",
      badge: "AWS"
    }
  ];

  const dataProtection = [
    {
      title: "Data Encryption",
      items: [
        "End-to-end encryption for sensitive data",
        "Encrypted database storage",
        "Secure API communications",
        "Protected file uploads"
      ]
    },
    {
      title: "Access Control",
      items: [
        "Role-based permissions",
        "Session management",
        "Automatic logout on inactivity",
        "IP-based restrictions available"
      ]
    },
    {
      title: "Monitoring",
      items: [
        "24/7 security monitoring",
        "Intrusion detection systems",
        "Real-time threat analysis",
        "Security event logging"
      ]
    },
    {
      title: "Compliance",
      items: [
        "GDPR compliant",
        "CCPA compliant",
        "SOC 2 Type II certified",
        "Regular security audits"
      ]
    }
  ];

  const bestPractices = [
    {
      icon: Key,
      title: "Use Strong Passwords",
      description: "Create unique passwords with at least 12 characters, including numbers and symbols."
    },
    {
      icon: Smartphone,
      title: "Enable 2FA",
      description: "Activate two-factor authentication for an additional security layer."
    },
    {
      icon: Eye,
      title: "Verify URLs",
      description: "Always check you're on zinglots.com before entering sensitive information."
    },
    {
      icon: UserCheck,
      title: "Keep Info Updated",
      description: "Maintain current contact information for security notifications."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Security - ZingLots</title>
        <meta name="description" content="Learn about ZingLots' comprehensive security measures and data protection policies." />
      </Helmet>
      
      <ModernNav />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-brand-red" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Security Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your security is our top priority. Learn how we protect your data and maintain a safe marketplace.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Badge className="px-4 py-2 text-sm">
            <Lock className="h-4 w-4 mr-2" />
            SSL Secured
          </Badge>
          <Badge className="px-4 py-2 text-sm">
            <ShieldCheck className="h-4 w-4 mr-2" />
            PCI Compliant
          </Badge>
          <Badge className="px-4 py-2 text-sm">
            <Globe className="h-4 w-4 mr-2" />
            GDPR Compliant
          </Badge>
          <Badge className="px-4 py-2 text-sm">
            <Activity className="h-4 w-4 mr-2" />
            99.9% Uptime
          </Badge>
        </div>

        {/* Security Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <feature.icon className="h-8 w-8 text-brand-red" />
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Protection Grid */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Data Protection Measures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dataProtection.map((section) => (
                <div key={section.title}>
                  <h3 className="font-semibold mb-3 text-brand-red">{section.title}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Security Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestPractices.map((practice) => (
              <Card key={practice.title} className="text-center">
                <CardContent className="pt-6">
                  <practice.icon className="h-12 w-12 text-brand-red mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{practice.title}</h3>
                  <p className="text-sm text-gray-600">{practice.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Incident Response */}
        <Card className="mb-12 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              Report Security Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you discover a security vulnerability or suspicious activity, please report it immediately:
            </p>
            <div className="bg-white rounded-lg p-4 space-y-2">
              <p><strong>Security Team Email:</strong> security@zinglots.com</p>
              <p><strong>24/7 Hotline:</strong> 1-800-SECURE-1 (1-800-732-8731)</p>
              <p><strong>Bug Bounty Program:</strong> Earn rewards for responsible disclosure</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              We take all security reports seriously and will respond within 24 hours.
            </p>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card>
          <CardHeader>
            <CardTitle>Security Certifications & Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <FileKey className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h4 className="font-semibold">SOC 2 Type II</h4>
                <p className="text-sm text-gray-600">Annual compliance audit</p>
                <p className="text-xs text-gray-500 mt-1">Last: December 2024</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h4 className="font-semibold">ISO 27001</h4>
                <p className="text-sm text-gray-600">Information security certified</p>
                <p className="text-xs text-gray-500 mt-1">Valid until: 2026</p>
              </div>
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h4 className="font-semibold">PCI DSS Level 1</h4>
                <p className="text-sm text-gray-600">Payment card security</p>
                <p className="text-xs text-gray-500 mt-1">Quarterly scans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>
            Last updated: January 2025 | Security policies are reviewed quarterly
          </p>
          <p className="mt-2">
            For detailed security documentation, contact our security team
          </p>
        </div>
      </div>
    </div>
  );
};

export default Security;