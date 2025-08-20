import { Helmet } from "react-helmet-async";
import ZingNav from "@/components/ZingNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

// Properly typed interfaces instead of any
interface LiveKitTokenResponse {
  url: string;
  token: string;
}

interface LiveKitTrack {
  kind: 'audio' | 'video';
  attach: (element: HTMLVideoElement) => void;
}

interface LiveKitRoom {
  connect: (url: string, token: string) => Promise<void>;
  localParticipant: {
    publishTrack: (track: LiveKitTrack) => Promise<void>;
  };
  disconnect: () => void;
}

interface LiveKitStatic {
  Room: new () => LiveKitRoom;
  createLocalTracks: (options: { audio: boolean; video: { facingMode: string } }) => Promise<LiveKitTrack[]>;
}

interface EgressStartResponse {
  egress_id?: string;
  room_composite_id?: string;
}

// Proper error handling
interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;
  
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

// Type guard for LiveKit track
function isVideoTrack(track: LiveKitTrack): track is LiveKitTrack & { kind: 'video' } {
  return track.kind === 'video';
}

export default function GoLive() {
  const { toast } = useToast();
  const sb = getSupabase();
  const [roomName, setRoomName] = useState(`show-${Date.now()}`);
  const [destinations, setDestinations] = useState<Array<{ url: string; key: string }>>([
    { url: '', key: '' },
  ]);
  const [egressId, setEgressId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Properly typed room ref instead of any
  const roomRef = useRef<LiveKitRoom | null>(null);

  useEffect(() => {
    return () => {
      try { 
        roomRef.current?.disconnect?.(); 
      } catch {
        // Silent cleanup
      }
    };
  }, []);

  const addDest = () => setDestinations((d) => [...d, { url: '', key: '' }]);
  const setDest = (i: number, field: 'url'|'key', val: string) => setDestinations((d) => d.map((x, idx) => idx===i? { ...x, [field]: val } : x));

  const connectPublisher = async () => {
    if (!sb) return;
    try {
      setConnecting(true);
      const { data, error } = await sb.functions.invoke('livekit-token', {
        body: { roomName, identity: 'seller', isPublisher: true },
      });
      if (error) throw error;
      
      // Properly type the response instead of any
      const response = data as LiveKitTokenResponse;
      const { url, token } = response;
      if (!url || !token) throw new Error('Missing LiveKit credentials');

      // Type the LiveKit import properly
      const LiveKit = await import('livekit-client') as LiveKitStatic;
      const room = new LiveKit.Room();
      await room.connect(url, token);
      roomRef.current = room;
      
      const tracks = await LiveKit.createLocalTracks({ 
        audio: true, 
        video: { facingMode: 'user' } 
      });
      
      for (const track of tracks) {
        await room.localParticipant.publishTrack(track);
      }

      // Properly find and handle video track
      const videoTrack = tracks.find(isVideoTrack);
      if (videoTrack && videoRef.current) {
        videoTrack.attach(videoRef.current);
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {
          // Silent fail for autoplay issues
        });
      }

      toast({ description: 'Connected to LiveKit. You are publishing.' });
    } catch (error: unknown) {
      const errorWithMessage = toErrorWithMessage(error);
      toast({ variant: 'destructive', description: errorWithMessage.message || 'Failed to connect' });
    } finally {
      setConnecting(false);
    }
  };

  const startSimulcast = async () => {
    if (!sb) return;
    try {
      const { data, error } = await sb.functions.invoke('livekit-start-egress', {
        body: { roomName, destinations: destinations.filter(d => d.url && d.key) },
      });
      if (error) throw error;
      
      // Properly type the egress response
      const egressResponse = data as EgressStartResponse;
      const responseEgressId = egressResponse?.egress_id || egressResponse?.room_composite_id || null;
      setEgressId(responseEgressId);
      toast({ description: 'Simulcast started' });
    } catch (error: unknown) {
      const errorWithMessage = toErrorWithMessage(error);
      toast({ variant: 'destructive', description: errorWithMessage.message || 'Failed to start simulcast' });
    }
  };

  const stopSimulcast = async () => {
    if (!sb || !egressId) return;
    try {
      const { error } = await sb.functions.invoke('livekit-stop-egress', { 
        body: { egress_id: egressId } 
      });
      if (error) throw error;
      toast({ description: 'Simulcast stop requested' });
    } catch (error: unknown) {
      const errorWithMessage = toErrorWithMessage(error);
      toast({ variant: 'destructive', description: errorWithMessage.message || 'Failed to stop simulcast' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Go Live | ZingLots</title>
        <meta name="description" content="Start your live show, publish to LiveKit, and simulcast to Facebook/Instagram." />
        <link rel="canonical" href="/seller/live" />
      </Helmet>
      <ZingNav />
      <main className="container mx-auto grid gap-6 px-4 py-8 md:grid-cols-3">
        <section className="md:col-span-2 space-y-4">
          <h1 className="text-3xl font-bold">Go Live</h1>
          <div className="rounded-lg border bg-card p-4 space-y-3">
            <div>
              <label className="text-sm">Room name</label>
              <Input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">RTMP Destinations</div>
              {destinations.map((d, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input placeholder="rtmps://…" value={d.url} onChange={(e) => setDest(i,'url', e.target.value)} />
                  <Input placeholder="stream key" value={d.key} onChange={(e) => setDest(i,'key', e.target.value)} />
                </div>
              ))}
              <Button variant="outline" onClick={addDest}>Add destination</Button>
            </div>
            <div className="flex gap-3">
              <Button onClick={connectPublisher} disabled={connecting} aria-disabled={connecting}>
                {connecting ? 'Connecting…' : 'Connect & Publish'}
              </Button>
              <Button variant="secondary" onClick={startSimulcast}>Start Simulcast</Button>
              <Button variant="outline" onClick={stopSimulcast} disabled={!egressId} aria-disabled={!egressId}>
                Stop Simulcast
              </Button>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-2">
            <video ref={videoRef} className="aspect-video w-full rounded-md bg-muted" playsInline muted />
          </div>
        </section>
        <aside>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm text-muted-foreground">Tip: Facebook RTMPS URL is rtmps://live-api-s.facebook.com:443/rtmp/</div>
            <div className="text-sm text-muted-foreground">Instagram Producer URL is rtmps://live-upload.instagram.com:443/rtmp/</div>
          </div>
        </aside>
      </main>
    </div>
  );
}