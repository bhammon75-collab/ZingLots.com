import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Truck, 
  DollarSign, 
  Package, 
  Calendar,
  AlertTriangle,
  Building2,
  CheckCircle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewPanelProps {
  formData: {
    title: string;
    description: string;
    vertical: string;
    uom: string;
    quantity: string;
    condition: string;
    weight_kg: string;
    length_cm: string;
    width_cm: string;
    height_cm: string;
    start_price_cents: string;
    reserve_price_cents: string;
    increment_cents: string;
    pickup_radius_km: string;
    pickup_window_start: string;
    pickup_window_end: string;
    needs_forklift: boolean;
    needs_dock: boolean;
    hazmat: boolean;
    msds_required: boolean;
    location_id: string;
    region_id: string;
    photos: File[];
    metadata: {
      serial_numbers: string;
      model_number: string;
      brand: string;
      compliance_certs: string;
      year_manufactured: string;
    };
    shipping_available: boolean;
    shipping_cost_cents?: string;
    buyer_premium_percent: string;
  };
}

const ReviewPanel = ({ formData }: ReviewPanelProps) => {
  const formatPrice = (cents: string) => {
    const dollars = parseInt(cents) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(dollars);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not specified';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getCategoryName = (id: string) => {
    const categories: Record<string, string> = {
      'contractor': 'Construction & Materials',
      'restaurant': 'Restaurant & Food Service',
      'office': 'Office & Business Equipment',
      'municipal': 'Government & Municipal Surplus'
    };
    return categories[id] || id;
  };

  const getConditionBadge = (condition: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'new': 'default',
      'like_new': 'default',
      'good': 'secondary',
      'fair': 'outline',
      'for_parts': 'destructive'
    };
    return (
      <Badge variant={variants[condition] || 'outline'}>
        {condition.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <Alert className="border-blue-200 bg-blue-50">
        <CheckCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription>
          Review your listing details below. This is how your auction will appear to buyers.
        </AlertDescription>
      </Alert>

      {/* Main Details Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{formData.title || 'Untitled Lot'}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">
                  <Building2 className="h-3 w-3 mr-1" />
                  {getCategoryName(formData.vertical)}
                </Badge>
                {getConditionBadge(formData.condition)}
                {formData.hazmat && (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    HAZMAT
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Starting at</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(formData.start_price_cents || '0')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.description && (
            <div>
              <h4 className="font-medium mb-1">Description</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{formData.description}</p>
            </div>
          )}

          <Separator />

          {/* Specifications */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Specifications
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Quantity:</span>
                <span className="ml-2 font-medium">{formData.quantity} {formData.uom}</span>
              </div>
              {formData.metadata.brand && (
                <div>
                  <span className="text-gray-500">Brand:</span>
                  <span className="ml-2 font-medium">{formData.metadata.brand}</span>
                </div>
              )}
              {formData.metadata.model_number && (
                <div>
                  <span className="text-gray-500">Model:</span>
                  <span className="ml-2 font-medium">{formData.metadata.model_number}</span>
                </div>
              )}
              {formData.metadata.year_manufactured && (
                <div>
                  <span className="text-gray-500">Year:</span>
                  <span className="ml-2 font-medium">{formData.metadata.year_manufactured}</span>
                </div>
              )}
              {formData.weight_kg && (
                <div>
                  <span className="text-gray-500">Weight:</span>
                  <span className="ml-2 font-medium">{formData.weight_kg} kg</span>
                </div>
              )}
              {(formData.length_cm || formData.width_cm || formData.height_cm) && (
                <div>
                  <span className="text-gray-500">Dimensions (L×W×H):</span>
                  <span className="ml-2 font-medium">
                    {formData.length_cm || '?'} × {formData.width_cm || '?'} × {formData.height_cm || '?'} cm
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Pricing Details */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pricing & Fees
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Starting Price:</span>
                <span className="font-medium">{formatPrice(formData.start_price_cents || '0')}</span>
              </div>
              {formData.reserve_price_cents && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Reserve Price:</span>
                  <span className="font-medium">{formatPrice(formData.reserve_price_cents)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Bid Increment:</span>
                <span className="font-medium">{formatPrice(formData.increment_cents || '500')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Buyer Premium:</span>
                <span className="font-medium">{formData.buyer_premium_percent || '10'}%</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Logistics */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Pickup & Shipping
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{formData.region_id || 'Location not specified'}</span>
                <Badge variant="outline" className="text-xs">
                  {formData.pickup_radius_km ? `${Math.round(parseFloat(formData.pickup_radius_km) * 0.621371)} mi radius` : '25 mi radius'}
                </Badge>
              </div>
              
              {(formData.pickup_window_start || formData.pickup_window_end) && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    Pickup: {formatDate(formData.pickup_window_start)} - {formatDate(formData.pickup_window_end)}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {formData.needs_forklift && (
                  <Badge variant="outline" className="text-xs">Forklift Required</Badge>
                )}
                {formData.needs_dock && (
                  <Badge variant="outline" className="text-xs">Dock Access Required</Badge>
                )}
                {formData.shipping_available ? (
                  <Badge variant="secondary" className="text-xs">
                    Shipping Available {formData.shipping_cost_cents && `(${formatPrice(formData.shipping_cost_cents)})`}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">Pickup Only</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Photos Preview */}
          {formData.photos.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">Photos ({formData.photos.length})</h4>
                <div className="grid grid-cols-4 gap-2">
                  {formData.photos.slice(0, 4).map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded border"
                      />
                      {index === 0 && (
                        <Badge className="absolute top-1 left-1 text-xs">Main</Badge>
                      )}
                    </div>
                  ))}
                  {formData.photos.length > 4 && (
                    <div className="flex items-center justify-center bg-gray-100 rounded border">
                      <span className="text-sm text-gray-500">+{formData.photos.length - 4} more</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Compliance Notice */}
      {(formData.hazmat || formData.msds_required) && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <strong>Compliance Requirements:</strong>
            <ul className="mt-1 ml-4 text-sm list-disc">
              {formData.hazmat && <li>This item contains hazardous materials</li>}
              {formData.msds_required && <li>MSDS documentation required for transfer</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ReviewPanel;