import { useCountdown } from "@/hooks/useCountdown";

type Props = { title:string; imageUrl:string; current:number; endsAt?:string };

export function AuctionCard({ title, imageUrl, current, endsAt }: Props) {
  const timeLeft = useCountdown(endsAt);

  return (
    <article className="group rounded-xl border border-line bg-white shadow-card hover:shadow-cardHover transition overflow-hidden">
      <div className="relative aspect-[4/3] bg-zinc-100">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]" />
        {timeLeft && (
          <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-medium shadow">
            {timeLeft.label}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold leading-snug">{title}</h3>
        <div className="mt-2 text-sm text-zinc-600">Current: ${current.toFixed(2)}</div>
      </div>
    </article>
  );
}