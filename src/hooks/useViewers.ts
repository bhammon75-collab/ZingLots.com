import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useViewers(roomId: string | undefined) {
  const [count, setCount] = useState<number>(0);
  const presenceKeyRef = useRef<string>(Math.random().toString(36).slice(2));

  useEffect(() => {
    if (!roomId) return;
    if (!supabase) {
      setCount(0);
      return;
    }
    const channel = supabase.channel(`room:lot-${roomId}`, {
      config: { presence: { key: presenceKeyRef.current } },
    });

    const update = () => {
      const state = channel.presenceState();
      // state is an object keyed by presence keys; count total members
      const groups = Object.values(state) as any[];
      let c = 0;
      for (const g of groups) c += Array.isArray(g) ? g.length : 0;
      setCount(c);
    };

    channel.on('presence', { event: 'sync' }, update);

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ online_at: new Date().toISOString() });
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [roomId]);

  return count;
}

