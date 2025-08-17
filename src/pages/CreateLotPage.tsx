import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  X, 
  Info, 
  Building2, 
  UtensilsCrossed, 
  Briefcase, 
  Wrench,
  Plus,
  Camera,
  FileText,
  MapPin,
  Clock,
  Truck,
  AlertTriangle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CreateLotPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    vertical: "",
    uom: "",
    quantity: "",
    condition: "",
    weight_kg: "",
    length_cm: "",
    width_cm: "",
    height_cm: "",
    start_price_cents: "",
    reserve_price_cents: "",
    increment_cents: "500",
    pickup_radius_km: "25",
    pickup_window_start: "",
    pickup_window_end: "",
    needs_forklift: false,
    needs_dock: false,
    hazmat: false,
    msds_required: false,
    location_id: "",
    region_id: "seattle",
    photos: [] as File[],
    metadata: {
      serial_numbers: "",
      model_number: "",
      brand: "",
      compliance_certs: "",
      year_manufactured: ""
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (formData.photos.length + files.length > 10) {
      setErrors({...errors, photos: "Maximum 10 photos allowed"});
      return;
    }
    setFormData({...formData, photos: [...formData.photos, ...files]});
    setErrors({...errors, photos: ""});
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({...formData, photos: newPhotos});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.vertical) newErrors.vertical = "Category is required";
    if (!formData.uom) newErrors.uom = "Unit of measure is required";
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) newErrors.quantity = "Valid quantity is required";
    if (!formData.condition) newErrors.condition = "Condition is required";
    if (!formData.start_price_cents || parseFloat(formData.start_price_cents) <= 0) newErrors.start_price_cents = "Valid starting price is required";
    if (formData.photos.length === 0) newErrors.photos = "At least one photo is required";
    
    // Validate dimensions if provided
    if (formData.length_cm && parseFloat(formData.length_cm) <= 0) newErrors.length_cm = "Valid length required";
    if (formData.width_cm && parseFloat(formData.width_cm) <= 0) newErrors.width_cm = "Valid width required";
    if (formData.height_cm && parseFloat(formData.height_cm) <= 0) newErrors.height_cm = "Valid height required";
    if (formData.weight_kg && parseFloat(formData.weight_kg) <= 0) newErrors.weight_kg = "Valid weight required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would upload photos and create the lot
      console.log("Creating lot:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to lot detail page
      navigate("/lot/new-lot-id", { 
        state: { message: "Lot created successfully! It will be reviewed before publishing." }
      });
      
    } catch (error) {
      console.error("Error creating lot:", error);
      setErrors({submit: "Failed to create lot. Please try again."});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Create New Lot</h1>
          <p className="text-gray-600 mt-2">List your business surplus equipment for auction</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide essential details about your surplus item
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
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the item, its condition, any defects, etc."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vertical">Category *</Label>
                  <Select value={formData.vertical} onValueChange={(value) => setFormData({...formData, vertical: value})}>
                    <SelectTrigger className={errors.vertical ? "border-red-500" : ""}>
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
                  {errors.vertical && <p className="text-red-500 text-sm mt-1">{errors.vertical}</p>}
                </div>

                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({...formData, condition: value})}>
                    <SelectTrigger className={errors.condition ? "border-red-500" : ""}>
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
                  {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
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
                    className={errors.quantity ? "border-red-500" : ""}
                  />
                  {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                </div>

                <div>
                  <Label htmlFor="uom">Unit of Measure *</Label>
                  <Select value={formData.uom} onValueChange={(value) => setFormData({...formData, uom: value})}>
                    <SelectTrigger className={errors.uom ? "border-red-500" : ""}>
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
                  {errors.uom && <p className="text-red-500 text-sm mt-1">{errors.uom}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photos
              </CardTitle>
              <CardDescription>
                Upload clear photos of your item (maximum 10)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
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
                          <Badge className="absolute bottom-1 left-1 text-xs">
                            Main
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.photos && <p className="text-red-500 text-sm">{errors.photos}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>
                Set your auction starting price and parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    className={errors.start_price_cents ? "border-red-500" : ""}
                  />
                  {errors.start_price_cents && <p className="text-red-500 text-sm mt-1">{errors.start_price_cents}</p>}
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
                  <p className="text-xs text-gray-500 mt-1">Minimum acceptable price</p>
                </div>

                <div>
                  <Label htmlFor="increment">Bid Increment ($)</Label>
                  <Input
                    id="increment"
                    type="number"
                    min="1"
                    step="1"
                    value={parseInt(formData.increment_cents) / 100}
                    onChange={(e) => setFormData({...formData, increment_cents: (parseFloat(e.target.value || "5") * 100).toString()})}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum bid increase</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pickup & Logistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Pickup & Logistics
              </CardTitle>
              <CardDescription>
                Configure pickup requirements and restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="pickup_radius">Pickup Radius (miles)</Label>
                <Input
                  id="pickup_radius"
                  type="number"
                  min="5"
                  max="100"
                  step="5"
                  value={formData.pickup_radius_km * 0.621371} // Convert km to miles for display
                  onChange={(e) => setFormData({...formData, pickup_radius_km: (parseFloat(e.target.value || "25") / 0.621371).toString()})}
                />
                <p className="text-xs text-gray-500 mt-1">Maximum distance buyers can be from pickup location</p>
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

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="needs_forklift"
                    checked={formData.needs_forklift}
                    onCheckedChange={(checked) => setFormData({...formData, needs_forklift: !!checked})}
                  />
                  <Label htmlFor="needs_forklift">Requires forklift for loading</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="needs_dock"
                    checked={formData.needs_dock}
                    onCheckedChange={(checked) => setFormData({...formData, needs_dock: !!checked})}
                  />
                  <Label htmlFor="needs_dock">Requires dock access</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hazmat"
                    checked={formData.hazmat}
                    onCheckedChange={(checked) => setFormData({...formData, hazmat: !!checked})}
                  />
                  <Label htmlFor="hazmat">Contains hazardous materials</Label>
                  {formData.hazmat && (
                    <Alert className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Hazmat items require special documentation and may have restricted bidding.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Advanced Details</CardTitle>
                  <CardDescription>
                    Optional technical specifications and dimensions
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? "Hide" : "Show"} Advanced
                </Button>
              </div>
            </CardHeader>
            {showAdvanced && (
              <CardContent className="space-y-6">
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
                    <Label htmlFor="year">Year Manufactured</Label>
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

                <Separator />

                <div>
                  <Label className="text-base font-medium">Dimensions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div>
                      <Label htmlFor="length" className="text-sm">Length (cm)</Label>
                      <Input
                        id="length"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.length_cm}
                        onChange={(e) => setFormData({...formData, length_cm: e.target.value})}
                        placeholder="120"
                      />
                    </div>

                    <div>
                      <Label htmlFor="width" className="text-sm">Width (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.width_cm}
                        onChange={(e) => setFormData({...formData, width_cm: e.target.value})}
                        placeholder="80"
                      />
                    </div>

                    <div>
                      <Label htmlFor="height" className="text-sm">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.height_cm}
                        onChange={(e) => setFormData({...formData, height_cm: e.target.value})}
                        placeholder="200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="weight" className="text-sm">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.weight_kg}
                        onChange={(e) => setFormData({...formData, weight_kg: e.target.value})}
                        placeholder="150"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="serial">Serial Numbers</Label>
                  <Textarea
                    id="serial"
                    value={formData.metadata.serial_numbers}
                    onChange={(e) => setFormData({
                      ...formData, 
                      metadata: {...formData.metadata, serial_numbers: e.target.value}
                    })}
                    placeholder="Enter serial numbers, one per line"
                    rows={3}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Creating Lot..." : "Create Lot"}
            </Button>
          </div>

          {errors.submit && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateLotPage;
