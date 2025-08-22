import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  X, 
  Building2, 
  UtensilsCrossed, 
  Briefcase, 
  Wrench,
  Camera,
  FileText,
  DollarSign,
  Truck,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Package,
  MapPin
} from "lucide-react";
import PhotoTips from "./PhotoTips";
import ReviewPanel from "./ReviewPanel";

// Zod schemas for each step
const photoSchema = z.object({
  photos: z.array(z.instanceof(File))
    .min(3, "At least 3 photos are required")
    .max(10, "Maximum 10 photos allowed")
});

const detailsSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description too long"),
  vertical: z.enum(['contractor', 'restaurant', 'office', 'municipal'], {
    errorMap: () => ({ message: "Please select a category" })
  }),
  condition: z.enum(['new', 'like_new', 'good', 'fair', 'for_parts'], {
    errorMap: () => ({ message: "Please select item condition" })
  }),
  quantity: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, "Quantity must be a positive number"),
  uom: z.enum(['piece', 'set', 'pallet', 'truckload', 'sqft', 'linearft'], {
    errorMap: () => ({ message: "Please select unit of measure" })
  }),
  metadata: z.object({
    brand: z.string().optional(),
    model_number: z.string().optional(),
    year_manufactured: z.string().optional(),
    serial_numbers: z.string().optional(),
    compliance_certs: z.string().optional()
  }),
  weight_kg: z.string().optional(),
  length_cm: z.string().optional(),
  width_cm: z.string().optional(),
  height_cm: z.string().optional()
});

const pricingSchema = z.object({
  start_price_cents: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 100, "Starting price must be at least $1.00"),
  reserve_price_cents: z.string().optional().refine(val => !val || (!isNaN(Number(val)) && Number(val) >= 100), "Reserve price must be at least $1.00"),
  increment_cents: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 100, "Bid increment must be at least $1.00"),
  buyer_premium_percent: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 25, "Buyer premium must be between 0-25%")
});

const shippingSchema = z.object({
  region_id: z.string().min(1, "Please select a location"),
  pickup_radius_km: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 5, "Pickup radius must be at least 5km"),
  pickup_window_start: z.string().optional(),
  pickup_window_end: z.string().optional(),
  needs_forklift: z.boolean(),
  needs_dock: z.boolean(),
  hazmat: z.boolean(),
  msds_required: z.boolean(),
  shipping_available: z.boolean(),
  shipping_cost_cents: z.string().optional()
});

const CreateLotWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Photos
    photos: [] as File[],
    
    // Details
    title: "",
    description: "",
    vertical: "",
    condition: "",
    quantity: "",
    uom: "",
    metadata: {
      brand: "",
      model_number: "",
      year_manufactured: "",
      serial_numbers: "",
      compliance_certs: ""
    },
    weight_kg: "",
    length_cm: "",
    width_cm: "",
    height_cm: "",
    
    // Pricing
    start_price_cents: "",
    reserve_price_cents: "",
    increment_cents: "500",
    buyer_premium_percent: "10",
    
    // Shipping
    region_id: "seattle",
    pickup_radius_km: "25",
    pickup_window_start: "",
    pickup_window_end: "",
    needs_forklift: false,
    needs_dock: false,
    hazmat: false,
    msds_required: false,
    shipping_available: false,
    shipping_cost_cents: "",
    location_id: ""
  });

  const steps = [
    { 
      title: "Photos", 
      icon: Camera, 
      description: "Upload quality photos of your items",
      schema: photoSchema
    },
    { 
      title: "Details", 
      icon: FileText, 
      description: "Describe what you're selling",
      schema: detailsSchema
    },
    { 
      title: "Pricing", 
      icon: DollarSign, 
      description: "Set your auction parameters",
      schema: pricingSchema
    },
    { 
      title: "Shipping", 
      icon: Truck, 
      description: "Configure pickup and delivery options",
      schema: shippingSchema
    },
    { 
      title: "Review", 
      icon: Eye, 
      description: "Review and publish your auction",
      schema: null
    }
  ];

  const verticals = [
    { id: 'contractor', name: 'Construction & Materials', icon: Building2 },
    { id: 'restaurant', name: 'Restaurant & Food Service', icon: UtensilsCrossed },
    { id: 'office', name: 'Office & Business Equipment', icon: Briefcase },
    { id: 'municipal', name: 'Government & Municipal Surplus', icon: Wrench }
  ];

  const uomOptions = [
    { id: 'piece', name: 'Piece' },
    { id: 'set', name: 'Set' },
    { id: 'pallet', name: 'Pallet' },
    { id: 'truckload', name: 'Truckload' },
    { id: 'sqft', name: 'Square Feet' },
    { id: 'linearft', name: 'Linear Feet' }
  ];

  const conditionOptions = [
    { id: 'new', name: 'New' },
    { id: 'like_new', name: 'Like New' },
    { id: 'good', name: 'Good' },
    { id: 'fair', name: 'Fair' },
    { id: 'for_parts', name: 'For Parts/Repair' }
  ];

  const regions = [
    { id: 'seattle', name: 'Seattle, WA' },
    { id: 'tacoma', name: 'Tacoma, WA' },
    { id: 'bellevue', name: 'Bellevue, WA' },
    { id: 'portland', name: 'Portland, OR' },
    { id: 'spokane', name: 'Spokane, WA' }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.photos.length + files.length > 10) {
      setValidationErrors({...validationErrors, photos: "Maximum 10 photos allowed"});
      return;
    }
    setFormData({...formData, photos: [...formData.photos, ...files]});
    setValidationErrors({...validationErrors, photos: ""});
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({...formData, photos: newPhotos});
  };

  const validateCurrentStep = () => {
    const step = steps[currentStep];
    if (!step.schema) return true;

    try {
      let dataToValidate: any = {};
      
      switch (currentStep) {
        case 0: // Photos
          dataToValidate = { photos: formData.photos };
          break;
        case 1: // Details
          dataToValidate = {
            title: formData.title,
            description: formData.description,
            vertical: formData.vertical,
            condition: formData.condition,
            quantity: formData.quantity,
            uom: formData.uom,
            metadata: formData.metadata,
            weight_kg: formData.weight_kg,
            length_cm: formData.length_cm,
            width_cm: formData.width_cm,
            height_cm: formData.height_cm
          };
          break;
        case 2: // Pricing
          dataToValidate = {
            start_price_cents: formData.start_price_cents,
            reserve_price_cents: formData.reserve_price_cents,
            increment_cents: formData.increment_cents,
            buyer_premium_percent: formData.buyer_premium_percent
          };
          break;
        case 3: // Shipping
          dataToValidate = {
            region_id: formData.region_id,
            pickup_radius_km: formData.pickup_radius_km,
            pickup_window_start: formData.pickup_window_start,
            pickup_window_end: formData.pickup_window_end,
            needs_forklift: formData.needs_forklift,
            needs_dock: formData.needs_dock,
            hazmat: formData.hazmat,
            msds_required: formData.msds_required,
            shipping_available: formData.shipping_available,
            shipping_cost_cents: formData.shipping_cost_cents
          };
          break;
      }

      step.schema.parse(dataToValidate);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log("Creating lot:", formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      navigate("/lot/new-lot-id", { 
        state: { message: "Lot created successfully! It will be reviewed and published within 24 hours." }
      });
    } catch (error) {
      console.error("Error creating lot:", error);
      setValidationErrors({submit: "Failed to create lot. Please try again."});
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Photos
        return (
          <div className="space-y-6">
            <PhotoTips />
            
            <Card>
              <CardHeader>
                <CardTitle>Upload Photos</CardTitle>
                <CardDescription>
                  Add 3-10 clear photos of your items. The first photo will be your main listing image.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB each</p>
                  </label>
                </div>
                
                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {validationErrors.photos && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{validationErrors.photos}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 1: // Details
        return (
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
              <CardDescription>
                Provide detailed information about what you're selling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., Commercial Pizza Oven - Blodgett Double Deck"
                  className={validationErrors.title ? "border-red-500" : ""}
                />
                {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description including condition, specifications, and any defects..."
                  rows={4}
                  className={validationErrors.description ? "border-red-500" : ""}
                />
                {validationErrors.description && <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vertical">Category *</Label>
                  <Select value={formData.vertical} onValueChange={(value) => setFormData({...formData, vertical: value})}>
                    <SelectTrigger className={validationErrors.vertical ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {verticals.map((vertical) => {
                        const IconComponent = vertical.icon;
                        return (
                          <SelectItem key={vertical.id} value={vertical.id}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              {vertical.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {validationErrors.vertical && <p className="text-red-500 text-sm mt-1">{validationErrors.vertical}</p>}
                </div>

                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                    <SelectTrigger className={validationErrors.condition ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((condition) => (
                        <SelectItem key={condition.id} value={condition.id}>
                          {condition.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.condition && <p className="text-red-500 text-sm mt-1">{validationErrors.condition}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="1"
                    className={validationErrors.quantity ? "border-red-500" : ""}
                  />
                  {validationErrors.quantity && <p className="text-red-500 text-sm mt-1">{validationErrors.quantity}</p>}
                </div>

                <div>
                  <Label htmlFor="uom">Unit of Measure *</Label>
                  <Select value={formData.uom} onValueChange={(value) => setFormData({...formData, uom: value})}>
                    <SelectTrigger className={validationErrors.uom ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {uomOptions.map((uom) => (
                        <SelectItem key={uom.id} value={uom.id}>
                          {uom.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.uom && <p className="text-red-500 text-sm mt-1">{validationErrors.uom}</p>}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Additional Details (Optional)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="brand">Brand/Manufacturer</Label>
                    <Input
                      id="brand"
                      value={formData.metadata.brand}
                      onChange={(e) => setFormData({
                        ...formData, 
                        metadata: {...formData.metadata, brand: e.target.value}
                      })}
                      placeholder="e.g., Blodgett"
                    />
                  </div>

                  <div>
                    <Label htmlFor="model">Model Number</Label>
                    <Input
                      id="model"
                      value={formData.metadata.model_number}
                      onChange={(e) => setFormData({
                        ...formData, 
                        metadata: {...formData.metadata, model_number: e.target.value}
                      })}
                      placeholder="e.g., 911 DOUBLE"
                    />
                  </div>

                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      value={formData.metadata.year_manufactured}
                      onChange={(e) => setFormData({
                        ...formData, 
                        metadata: {...formData.metadata, year_manufactured: e.target.value}
                      })}
                      placeholder="e.g., 2018"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      value={formData.length_cm}
                      onChange={(e) => setFormData({...formData, length_cm: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={formData.width_cm}
                      onChange={(e) => setFormData({...formData, width_cm: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height_cm}
                      onChange={(e) => setFormData({...formData, height_cm: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={formData.weight_kg}
                      onChange={(e) => setFormData({...formData, weight_kg: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 2: // Pricing
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Reserve</CardTitle>
              <CardDescription>
                Set your auction pricing parameters and fees
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="start_price">Starting Price ($) *</Label>
                  <Input
                    id="start_price"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.start_price_cents ? (parseInt(formData.start_price_cents) / 100).toString() : ""}
                    onChange={(e) => setFormData({...formData, start_price_cents: (parseFloat(e.target.value || "0") * 100).toString()})}
                    placeholder="100"
                    className={validationErrors.start_price_cents ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum bid to start the auction</p>
                  {validationErrors.start_price_cents && <p className="text-red-500 text-sm mt-1">{validationErrors.start_price_cents}</p>}
                </div>

                <div>
                  <Label htmlFor="reserve_price">Reserve Price ($)</Label>
                  <Input
                    id="reserve_price"
                    type="number"
                    min="1"
                    step="1"
                    value={formData.reserve_price_cents ? (parseInt(formData.reserve_price_cents) / 100).toString() : ""}
                    onChange={(e) => setFormData({...formData, reserve_price_cents: (parseFloat(e.target.value || "0") * 100).toString()})}
                    placeholder="Optional"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum price you'll accept (hidden from buyers)</p>
                  {validationErrors.reserve_price_cents && <p className="text-red-500 text-sm mt-1">{validationErrors.reserve_price_cents}</p>}
                </div>

                <div>
                  <Label htmlFor="increment">Bid Increment ($) *</Label>
                  <Input
                    id="increment"
                    type="number"
                    min="1"
                    step="1"
                    value={parseInt(formData.increment_cents) / 100}
                    onChange={(e) => setFormData({...formData, increment_cents: (parseFloat(e.target.value || "5") * 100).toString()})}
                    className={validationErrors.increment_cents ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum amount bids must increase</p>
                  {validationErrors.increment_cents && <p className="text-red-500 text-sm mt-1">{validationErrors.increment_cents}</p>}
                </div>

                <div>
                  <Label htmlFor="premium">Buyer Premium (%) *</Label>
                  <Input
                    id="premium"
                    type="number"
                    min="0"
                    max="25"
                    step="1"
                    value={formData.buyer_premium_percent}
                    onChange={(e) => setFormData({...formData, buyer_premium_percent: e.target.value})}
                    className={validationErrors.buyer_premium_percent ? "border-red-500" : ""}
                  />
                  <p className="text-xs text-gray-500 mt-1">Additional fee charged to winning bidder</p>
                  {validationErrors.buyer_premium_percent && <p className="text-red-500 text-sm mt-1">{validationErrors.buyer_premium_percent}</p>}
                </div>
              </div>

              <Alert className="border-blue-200 bg-blue-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  <strong>Fee Structure:</strong>
                  <ul className="mt-2 ml-4 text-sm list-disc">
                    <li>Seller fee: 0% during promotional period</li>
                    <li>Buyer's Premium: {formData.buyer_premium_percent || '9'}% added to winning bid (min $2/lot)</li>
                    <li>No listing fees - list for free!</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      case 3: // Shipping
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pickup & Shipping</CardTitle>
              <CardDescription>
                Configure how buyers can receive their items
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="location">Pickup Location *</Label>
                <Select value={formData.region_id} onValueChange={(value) => setFormData({...formData, region_id: value})}>
                  <SelectTrigger className={validationErrors.region_id ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {region.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.region_id && <p className="text-red-500 text-sm mt-1">{validationErrors.region_id}</p>}
              </div>

              <div>
                <Label htmlFor="pickup_radius">Pickup Radius (miles) *</Label>
                <Input
                  id="pickup_radius"
                  type="number"
                  min="5"
                  max="100"
                  step="5"
                  value={Math.round(parseFloat(formData.pickup_radius_km || "25") * 0.621371)}
                  onChange={(e) => setFormData({...formData, pickup_radius_km: (parseFloat(e.target.value || "25") / 0.621371).toString()})}
                  className={validationErrors.pickup_radius_km ? "border-red-500" : ""}
                />
                <p className="text-xs text-gray-500 mt-1">Maximum distance buyers can be from pickup location</p>
                {validationErrors.pickup_radius_km && <p className="text-red-500 text-sm mt-1">{validationErrors.pickup_radius_km}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickup_start">Pickup Window Start</Label>
                  <Input
                    id="pickup_start"
                    type="datetime-local"
                    value={formData.pickup_window_start}
                    onChange={(e) => setFormData({...formData, pickup_window_start: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="pickup_end">Pickup Window End</Label>
                  <Input
                    id="pickup_end"
                    type="datetime-local"
                    value={formData.pickup_window_end}
                    onChange={(e) => setFormData({...formData, pickup_window_end: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Requirements & Restrictions</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="needs_forklift"
                      checked={formData.needs_forklift}
                      onCheckedChange={(checked) => setFormData({...formData, needs_forklift: !!checked})}
                    />
                    <Label htmlFor="needs_forklift" className="font-normal">
                      Requires forklift for loading
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="needs_dock"
                      checked={formData.needs_dock}
                      onCheckedChange={(checked) => setFormData({...formData, needs_dock: !!checked})}
                    />
                    <Label htmlFor="needs_dock" className="font-normal">
                      Requires loading dock access
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hazmat"
                      checked={formData.hazmat}
                      onCheckedChange={(checked) => setFormData({...formData, hazmat: !!checked})}
                    />
                    <Label htmlFor="hazmat" className="font-normal">
                      Contains hazardous materials
                    </Label>
                  </div>

                  {formData.hazmat && (
                    <div className="flex items-center space-x-2 ml-6">
                      <Checkbox
                        id="msds"
                        checked={formData.msds_required}
                        onCheckedChange={(checked) => setFormData({...formData, msds_required: !!checked})}
                      />
                      <Label htmlFor="msds" className="font-normal">
                        MSDS documentation required
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shipping"
                    checked={formData.shipping_available}
                    onCheckedChange={(checked) => setFormData({...formData, shipping_available: !!checked})}
                  />
                  <Label htmlFor="shipping" className="font-normal">
                    Offer shipping option
                  </Label>
                </div>

                {formData.shipping_available && (
                  <div className="ml-6">
                    <Label htmlFor="shipping_cost">Shipping Cost ($)</Label>
                    <Input
                      id="shipping_cost"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.shipping_cost_cents ? (parseInt(formData.shipping_cost_cents) / 100).toString() : ""}
                      onChange={(e) => setFormData({...formData, shipping_cost_cents: (parseFloat(e.target.value || "0") * 100).toString()})}
                      placeholder="Leave blank for quote on request"
                    />
                    <p className="text-xs text-gray-500 mt-1">Fixed shipping cost or leave blank for custom quotes</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 4: // Review
        return <ReviewPanel formData={formData} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Auction Lot</h1>
              <p className="text-sm text-gray-600 mt-1">List your business surplus for auction</p>
            </div>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        index < currentStep
                          ? 'bg-green-600 border-green-600 text-white'
                          : index === currentStep
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {index < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`text-xs mt-1 ${index === currentStep ? 'font-medium' : ''}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 transition-colors ${
                        index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-1" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </div>

        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>Publishing...</>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Publish Auction
                </>
              )}
            </Button>
          )}
        </div>

        {validationErrors.submit && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationErrors.submit}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default CreateLotWizard;