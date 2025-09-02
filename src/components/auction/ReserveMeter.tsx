import React from "react";

type ReserveMeterProps = {
  reserve: number | null | undefined;
  currentPrice: number;
  className?: string;
};

export function ReserveMeter({ reserve, currentPrice, className }: ReserveMeterProps){
  if (!reserve || reserve <= 0) return null;

  const clamped = Math.max(0, Math.min(currentPrice, reserve));
  const percent = Math.round((clamped / reserve) * 100);
  const isMet = currentPrice >= reserve;

  const label = isMet ? "Reserve met" : "Reserve not met";

  return (
    <div className={className} aria-label={label}>
      <div className="flex items-center justify-between text-xs mb-1 text-gray-600">
        <span>{label}</span>
        <span>
          {isMet ? "100%" : `${percent}%`}
        </span>
      </div>
      <div
        className="h-2 w-full rounded bg-gray-200 overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={reserve}
        aria-valuenow={Math.min(currentPrice, reserve)}
      >
        <div
          className={`h-full ${isMet ? "bg-green-500" : "bg-amber-500"}`}
          style={{ width: `${isMet ? 100 : percent}%` }}
        />
      </div>
    </div>
  );
}

export default ReserveMeter;

