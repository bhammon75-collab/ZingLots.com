import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Eye, 
  Ear, 
  Hand, 
  Brain, 
  Keyboard,
  Monitor,
  Smartphone,
  CheckCircle,
  Info
} from "lucide-react";

const Accessibility = () => {
  const features = [
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Full keyboard accessibility throughout the platform. Navigate using Tab, Enter, and arrow keys."
    },
    {
      icon: Eye,
      title: "Screen Reader Support",
      description: "Compatible with popular screen readers including NVDA, JAWS, and VoiceOver."
    },
    {
      icon: Monitor,
      title: "High Contrast Mode",
      description: "Enhanced contrast ratios meeting WCAG 2.1 AA standards for better visibility."
    },
    {
      icon: Smartphone,
      title: "Mobile Accessibility",
      description: "Fully responsive design with touch-friendly controls and gestures."
    }
  ];

  const guidelines = [
    {
      category: "Visual",
      items: [
        "Alt text for all images and icons",
        "Sufficient color contrast (4.5:1 for normal text)",
        "Resizable text up to 200% without loss of functionality",
        "No reliance on color alone to convey information"
      ]
    },
    {
      category: "Auditory",
      items: [
        "Captions for video content",
        "Visual indicators for audio alerts",
        "Transcripts available for audio content"
      ]
    },
    {
      category: "Motor",
      items: [
        "Large clickable areas (minimum 44x44 pixels)",
        "Adequate spacing between interactive elements",
        "No time limits on form completion",
        "Keyboard shortcuts for common actions"
      ]
    },
    {
      category: "Cognitive",
      items: [
        "Clear and simple language",
        "Consistent navigation and layout",
        "Error messages with helpful suggestions",
        "Progress indicators for multi-step processes"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Accessibility - ZingLots</title>
        <meta name="description" content="Learn about ZingLots' commitment to digital accessibility and inclusive design." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Accessibility Statement</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ZingLots is committed to ensuring digital accessibility for people with disabilities. 
            We continually improve the user experience for everyone and apply relevant accessibility standards.
          </p>
        </div>

        {/* Compliance Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              WCAG 2.1 Level AA Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Our website substantially conforms to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. 
              These guidelines help make web content more accessible to people with disabilities.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900">
                    We regularly test our platform using automated tools and manual testing with assistive technologies.
                    Last accessibility audit: January 2025
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Accessibility Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 text-brand-red mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Guidelines */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Accessibility Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.map((section) => (
              <Card key={section.category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {section.category === "Visual" && <Eye className="h-5 w-5" />}
                    {section.category === "Auditory" && <Ear className="h-5 w-5" />}
                    {section.category === "Motor" && <Hand className="h-5 w-5" />}
                    {section.category === "Cognitive" && <Brain className="h-5 w-5" />}
                    {section.category} Accessibility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Keyboard Shortcuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Navigation</h4>
                <ul className="space-y-1 text-sm">
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Tab</kbd> - Navigate forward</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Shift + Tab</kbd> - Navigate backward</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> - Activate buttons/links</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> - Close modals/menus</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quick Actions</h4>
                <ul className="space-y-1 text-sm">
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Alt + S</kbd> - Skip to main content</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Alt + M</kbd> - Open main menu</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">Alt + H</kbd> - Go to help</li>
                  <li><kbd className="px-2 py-1 bg-gray-100 rounded">/</kbd> - Focus search</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Need Assistance?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              We're committed to providing an accessible experience for all users. If you encounter any accessibility 
              barriers or have suggestions for improvement, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p><strong>Email:</strong> accessibility@zinglots.com</p>
              <p><strong>Phone:</strong> 1-800-ZINGLOT (1-800-946-4568)</p>
              <p><strong>Hours:</strong> Monday-Friday, 9 AM - 5 PM PST</p>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We aim to respond to accessibility feedback within 2 business days.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accessibility;