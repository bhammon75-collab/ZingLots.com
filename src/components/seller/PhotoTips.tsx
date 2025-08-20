import { Camera, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PhotoTips = () => {
  const dos = [
    "Take photos in good lighting - natural light works best",
    "Capture all angles - front, back, sides, top",
    "Include close-ups of important details, serial numbers, and any damage",
    "Show items in their actual condition - buyers appreciate transparency",
    "Include a reference object for scale when helpful"
  ];

  const donts = [
    "Don't use blurry or dark photos",
    "Avoid cluttered backgrounds - use a clean, neutral backdrop",
    "Don't use stock photos or photos from the manufacturer",
    "Avoid heavy filters or editing that misrepresents the item"
  ];

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Camera className="h-5 w-5 text-blue-600" />
          Photo Guidelines for B2B Auctions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-amber-200 bg-amber-50">
          <Lightbulb className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm">
            <strong>Pro Tip:</strong> Quality photos can increase final bid prices by up to 30%. 
            Business buyers need to see exactly what they're purchasing.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-green-700 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Do's
            </h4>
            <ul className="space-y-1 text-sm text-gray-700">
              {dos.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-red-700 flex items-center gap-1">
              <XCircle className="h-4 w-4" />
              Don'ts
            </h4>
            <ul className="space-y-1 text-sm text-gray-700">
              {donts.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-600">
            <strong>Required:</strong> Minimum 3 photos, maximum 10. First photo will be the main listing image.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoTips;