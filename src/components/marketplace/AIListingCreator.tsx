import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Upload, Check, AlertCircle, Package, Ruler, Weight, Truck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIGeneratedListing {
  suggestedTitle: string;
  suggestedDescription: string;
  bulletSpecs: {
    model?: string;
    dimensions?: string;
    power?: string;
    quantity?: number;
    unitOfMeasure?: string;
    condition?: string;
  };
  category: string;
  subcategory: string;
  hazmatFlags: string[];
  policyNotes: string[];
  estimatedWeightKg?: number;
  estimatedDimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  requiresForklift: boolean;
  requiresLoadingDock: boolean;
  altText: string[];
}

interface ValuationResult {
  lowCents: number;
  highCents: number;
  suggestedStartCents: number;
  suggestedReserveCents?: number;
  confidenceScore: number;
  rationale: string;
  keyFactors: string[];
  marketTrend: 'increasing' | 'stable' | 'decreasing';
}

export const AIListingCreator: React.FC = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValuating, setIsValuating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIGeneratedListing | null>(null);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
    });
  };

  const generateWithAI = async () => {
    setIsGenerating(true);
    try {
      // Convert images to base64
      const imageData = await Promise.all(
        images.map(async (img) => ({
          data: await convertToBase64(img),
          media_type: img.type
        }))
      );

      // Call the listing-copilot edge function
      const { data, error } = await supabase.functions.invoke('listing-copilot', {
        body: {
          title,
          description,
          photos: imageData
        }
      });

      if (error) throw error;

      setAiSuggestions(data);
      toast({
        title: "AI Analysis Complete",
        description: "Review and accept the suggestions below",
      });
    } catch (error) {
      console.error('Error generating with AI:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getValuation = async () => {
    if (!aiSuggestions) return;
    
    setIsValuating(true);
    try {
      // Call the valuation-agent edge function
      const { data, error } = await supabase.functions.invoke('valuation-agent', {
        body: {
          itemId: 'temp-' + Date.now(), // Temporary ID for demo
          title: aiSuggestions.suggestedTitle || title,
          description: aiSuggestions.suggestedDescription || description,
          category: aiSuggestions.category,
          condition: aiSuggestions.bulletSpecs?.condition,
          quantity: aiSuggestions.bulletSpecs?.quantity,
          unitOfMeasure: aiSuggestions.bulletSpecs?.unitOfMeasure,
        }
      });

      if (error) throw error;

      setValuation(data);
      toast({
        title: "Valuation Complete",
        description: `Suggested price range: $${(data.lowCents / 100).toFixed(2)} - $${(data.highCents / 100).toFixed(2)}`,
      });
    } catch (error) {
      console.error('Error getting valuation:', error);
      toast({
        title: "Valuation Failed",
        description: "Unable to generate valuation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValuating(false);
    }
  };

  const acceptSuggestion = (field: string) => {
    setAcceptedSuggestions(new Set(acceptedSuggestions).add(field));
    
    if (field === 'title' && aiSuggestions?.suggestedTitle) {
      setTitle(aiSuggestions.suggestedTitle);
    }
    if (field === 'description' && aiSuggestions?.suggestedDescription) {
      setDescription(aiSuggestions.suggestedDescription);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Powered Listing Creator
          </CardTitle>
          <CardDescription>
            Let our AI help you create professional B2B surplus listings in seconds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Commercial Kitchen Equipment"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="images">Photos</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              {images.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {images.length} image(s) selected
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any details you know about the item..."
              rows={4}
            />
          </div>

          <Button 
            onClick={generateWithAI}
            disabled={isGenerating || images.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Listing with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      {aiSuggestions && (
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
            <CardDescription>
              Review and accept the AI-generated content for your listing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title Suggestion */}
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Label>Suggested Title</Label>
                {!acceptedSuggestions.has('title') ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acceptSuggestion('title')}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Accept
                  </Button>
                ) : (
                  <Badge variant="secondary">
                    <Check className="mr-1 h-3 w-3" />
                    Accepted
                  </Badge>
                )}
              </div>
              <p className="font-medium">{aiSuggestions.suggestedTitle}</p>
            </div>

            {/* Category & Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <Label className="mb-2 block">Category</Label>
                <Badge>{aiSuggestions.category}</Badge>
                <Badge variant="outline" className="ml-2">
                  {aiSuggestions.subcategory}
                </Badge>
              </div>

              <div className="p-4 border rounded-lg">
                <Label className="mb-2 block">Condition</Label>
                <Badge variant="secondary">
                  {aiSuggestions.bulletSpecs?.condition || 'Unknown'}
                </Badge>
              </div>
            </div>

            {/* Specifications */}
            <div className="p-4 border rounded-lg space-y-3">
              <Label>Detected Specifications</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {aiSuggestions.bulletSpecs?.quantity && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {aiSuggestions.bulletSpecs.quantity} {aiSuggestions.bulletSpecs.unitOfMeasure}
                    </span>
                  </div>
                )}
                {aiSuggestions.estimatedWeightKg && (
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{aiSuggestions.estimatedWeightKg} kg</span>
                  </div>
                )}
                {aiSuggestions.estimatedDimensions?.length && (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {aiSuggestions.estimatedDimensions.length}x
                      {aiSuggestions.estimatedDimensions.width}x
                      {aiSuggestions.estimatedDimensions.height} cm
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Logistics Requirements */}
            <div className="p-4 border rounded-lg">
              <Label className="mb-2 block">Logistics Requirements</Label>
              <div className="flex gap-2">
                {aiSuggestions.requiresForklift && (
                  <Badge variant="outline">
                    <Truck className="mr-1 h-3 w-3" />
                    Forklift Required
                  </Badge>
                )}
                {aiSuggestions.requiresLoadingDock && (
                  <Badge variant="outline">
                    Loading Dock Required
                  </Badge>
                )}
                {!aiSuggestions.requiresForklift && !aiSuggestions.requiresLoadingDock && (
                  <Badge variant="secondary">Standard Pickup</Badge>
                )}
              </div>
            </div>

            {/* Hazmat & Policy Flags */}
            {(aiSuggestions.hazmatFlags.length > 0 || aiSuggestions.policyNotes.length > 0) && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important Notes:</strong>
                  <ul className="mt-2 space-y-1">
                    {aiSuggestions.hazmatFlags.map((flag, i) => (
                      <li key={i} className="text-sm">• {flag}</li>
                    ))}
                    {aiSuggestions.policyNotes.map((note, i) => (
                      <li key={i} className="text-sm">• {note}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Get Valuation Button */}
            <Button 
              onClick={getValuation}
              disabled={isValuating}
              className="w-full"
              variant="secondary"
            >
              {isValuating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Market Valuation...
                </>
              ) : (
                <>
                  Get AI Valuation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Valuation Results */}
      {valuation && (
        <Card>
          <CardHeader>
            <CardTitle>AI Market Valuation</CardTitle>
            <CardDescription>
              Data-driven pricing based on comparable sales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Estimated Value Range</p>
                <p className="text-2xl font-bold">
                  ${(valuation.lowCents / 100).toFixed(0)} - ${(valuation.highCents / 100).toFixed(0)}
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Suggested Start Price</p>
                <p className="text-2xl font-bold text-green-600">
                  ${(valuation.suggestedStartCents / 100).toFixed(2)}
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Confidence Score</p>
                <p className="text-2xl font-bold">
                  {valuation.confidenceScore}%
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <Label className="mb-2 block">Valuation Rationale</Label>
              <p className="text-sm">{valuation.rationale}</p>
            </div>

            <div className="p-4 border rounded-lg">
              <Label className="mb-2 block">Key Value Factors</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {valuation.keyFactors.map((factor, i) => (
                  <Badge key={i} variant="outline">{factor}</Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <Label>Market Trend</Label>
              <Badge 
                variant={
                  valuation.marketTrend === 'increasing' ? 'default' :
                  valuation.marketTrend === 'decreasing' ? 'destructive' : 
                  'secondary'
                }
              >
                {valuation.marketTrend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
