import * as React from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWatchlist } from '@/hooks/useWatchlist'

export function WatchButton({ lotId, initialWatching=false, onChange }:{
  lotId: string; initialWatching?: boolean; onChange?: (watching:boolean)=>void
}) {
  const { watched, loading, toggle } = useWatchlist(lotId)

  const handleClick = async () => {
    await toggle()
    onChange?.(!watched)
  }

  return (
    <Button variant={watched ? 'secondary' : 'outline'} onClick={handleClick} disabled={loading} title="Watch this lot">
      <Star className="mr-2 h-4 w-4" /> {watched ? 'Watching' : 'Watch'}
    </Button>
  )
}