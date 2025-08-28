import React, { useMemo, useState } from "react";

export type CategoryIconName =
  | "anvil"
  | "cutlery"
  | "shirt"
  | "bulldozer"
  | "briefcase"
  | "dumbbells"
  | "sofa"
  | "flask"
  | "ring"
  | "wrench";

export type CategoryIconProps = {
  name: CategoryIconName;
  className?: string;
  alt?: string;
};

const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className, alt }) => {
  const candidates = useMemo(() => [
    // Primary app public path
    `/icons/${name}_128.png`,
    `/icons/${name}-128.png`,
    `/icons/${name}128.png`,
    `/icons/${name}.png`,
    // Temporary fallback: files uploaded under ZingLots.com/public/icons
    `/ZingLots.com/public/icons/${name}_128.png`,
    `/ZingLots.com/public/icons/${name}-128.png`,
    `/ZingLots.com/public/icons/${name}128.png`,
    `/ZingLots.com/public/icons/${name}.png`,
  ], [name]);

  const [candidateIndex, setCandidateIndex] = useState(0);
  const src = candidates[Math.min(candidateIndex, candidates.length - 1)];

  return (
    <img
      src={src}
      width={128}
      height={128}
      loading="lazy"
      decoding="async"
      className={["object-contain", className].filter(Boolean).join(" ")}
      alt={alt ?? name}
      onError={() => {
        setCandidateIndex((prev) => (prev + 1 < candidates.length ? prev + 1 : prev));
      }}
    />
  );
};

export default CategoryIcon;

