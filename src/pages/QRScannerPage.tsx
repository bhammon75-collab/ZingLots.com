import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Upload,
  ArrowLeft,
  Smartphone,
  Truck,
  Clock,
  User,
  DollarSign
} from "lucide-react";

const QRScannerPage = () => {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedToken, setScannedToken] = useState("");
  const [manualToken, setManualToken] = useState("");
  const [pickupNotes, setPickupNotes] = useState("");
  const [proofPhotos, setProofPhotos] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [lotDetails, setLotDetails] = useState<any>(null);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  // Mock lot data - in real app, fetch from API
  useEffect(() => {
    setLotDetails({
      id: lotId,
      title: "Commercial Pizza Oven - Blodgett Double Deck",
      winner: "Pacific Restaurant Supply",
      winnerContact: "john@pacificrestaurant.com",
      finalPrice: 3200,
      paymentStatus: "paid",
      pickupWindow: "Dec 15-17, 2024",
      location: "Georgetown Industrial District",
      needsForklift: true,
      escrowAmount: 3200,
      sellerPayout: 3200 // No seller fee during promo period
    });
  }, [lotId]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "environment", // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setScannerActive(true);
        setCameraPermission('granted');
        
        // Start scanning for QR codes
        scanForQRCode();
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      setCameraPermission('denied');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setScannerActive(false);
    }
  };

  const scanForQRCode = () => {
    // In a real implementation, this would use a QR code scanning library
    // like @zxing/library or qr-scanner
    // For now, we'll simulate scanning
    if (!scannerActive) return;
    
    setTimeout(() => {
      // Simulate successful QR scan
      if (Math.random() > 0.7) { // 30% chance of "successful" scan
        const mockToken = "pickup_" + Math.random().toString(36).substr(2, 9);
        setScannedToken(mockToken);
        stopCamera();
      } else {
        scanForQRCode(); // Continue scanning
      }
    }, 1000);
  };

  const handleProofPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProofPhotos([...proofPhotos, ...files]);
  };

  const removeProofPhoto = (index: number) => {
    setProofPhotos(proofPhotos.filter((_, i) => i !== index));
  };

  const confirmPickup = async () => {
    const token = scannedToken || manualToken;
    if (!token) {
      setErrorMessage("Please scan QR code or enter token manually");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // In real app, call pickup-confirm Edge Function
      console.log("Confirming pickup:", {
        lotId,
        qrToken: token,
        notes: pickupNotes,
        proofPhotos: proofPhotos.map(f => f.name)
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful response
      if (Math.random() > 0.1) { // 90% success rate
        setScanResult('success');
      } else {
        throw new Error("Invalid QR token");
      }
      
    } catch (error) {
      console.error("Pickup confirmation failed:", error);
      setScanResult('error');
      setErrorMessage(error instanceof Error ? error.message : "Pickup confirmation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setScannedToken("");
    setManualToken("");
    setPickupNotes("");
    setProofPhotos([]);
    setScanResult(null);
    setErrorMessage("");
  };

  if (!lotDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lot details...</p>
        </div>
      </div>
    );
  }

  if (scanResult === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pickup Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Payment of ${lotDetails.sellerPayout.toLocaleString()} has been transferred to your account.
            </p>
            <div className="space-y-3">
              <Button onClick={() => navigate("/dashboard/seller")} className="w-full">
                View Dashboard
              </Button>
              <Button variant="outline" onClick={reset} className="w-full">
                Scan Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-semibold">Pickup Confirmation</h1>
              <p className="text-sm text-gray-600">Lot #{lotId}</p>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Lot Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Pickup Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{lotDetails.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>Winner: {lotDetails.winner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>Final Price: ${lotDetails.finalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Pickup Window: {lotDetails.pickupWindow}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Badge 
                  variant={lotDetails.paymentStatus === 'paid' ? 'default' : 'secondary'}
                  className={lotDetails.paymentStatus === 'paid' ? 'bg-green-500' : ''}
                >
                  Payment: {lotDetails.paymentStatus}
                </Badge>
                {lotDetails.needsForklift && (
                  <Badge variant="outline">
                    <Truck className="h-3 w-3 mr-1" />
                    Forklift Required
                  </Badge>
                )}
                <div className="text-sm text-gray-600">
                  <strong>Your Payout:</strong> ${lotDetails.sellerPayout.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Scan Buyer QR Code
            </CardTitle>
            <CardDescription>
              Have the buyer show their pickup QR code from their phone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {cameraPermission === 'pending' && (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Ready to scan QR code</p>
                <Button onClick={startCamera}>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              </div>
            )}

            {cameraPermission === 'denied' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Camera access is required to scan QR codes. Please enable camera permissions or enter the token manually below.
                </AlertDescription>
              </Alert>
            )}

            {scannerActive && (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full rounded-lg bg-black"
                  style={{ maxHeight: '300px' }}
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                  <div className="absolute inset-4 border border-blue-300 rounded"></div>
                </div>
                <Button
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={stopCamera}
                >
                  Stop
                </Button>
              </div>
            )}

            {scannedToken && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  QR code scanned successfully! Token: {scannedToken}
                </AlertDescription>
              </Alert>
            )}

            {/* Manual Token Entry */}
            <div className="border-t pt-4">
              <Label htmlFor="manual-token">Or enter pickup token manually:</Label>
              <Input
                id="manual-token"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                placeholder="pickup_abc123xyz"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pickup Confirmation */}
        {(scannedToken || manualToken) && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Pickup</CardTitle>
              <CardDescription>
                Add any notes and optional proof photos before confirming
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Pickup Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={pickupNotes}
                  onChange={(e) => setPickupNotes(e.target.value)}
                  placeholder="Any notes about the pickup condition, special instructions, etc."
                  rows={3}
                />
              </div>

              <div>
                <Label>Proof Photos (Optional)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleProofPhotoUpload}
                    className="hidden"
                    id="proof-upload"
                  />
                  <label htmlFor="proof-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Upload photos of the pickup
                      </p>
                    </div>
                  </label>
                </div>

                {proofPhotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {proofPhotos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Proof ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeProofPhoto(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errorMessage && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={confirmPickup}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Pickup...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Pickup & Release Payment
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                This will transfer ${lotDetails.sellerPayout.toLocaleString()} to your account
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QRScannerPage;
