import React from "react";

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
  const src = `/icons/${name}_128.png`;
  return (
    <img
      src={src}
      width={128}
      height={128}
      loading="lazy"
      decoding="async"
      className={["object-contain", className].filter(Boolean).join(" ")}
      alt={alt ?? name}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement;
        if (!target?.dataset?.fallback) {
          target.src = "/icons/zinglots-icon.svg";
          target.dataset.fallback = "true";
        }
      }}
    />
  );
};

export default CategoryIcon;

