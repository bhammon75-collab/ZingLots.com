import { Link } from "react-router-dom";

type Props = {
  variant?: "header" | "footer";
  iconOnly?: boolean;
  iconSrc?: string;
  className?: string;
  size?: number;
  textClassName?: string;
};

export default function Brand({
  variant = "header",
  iconOnly = false,
  iconSrc = "/favicon-32x32.png",
  className = "",
  size = variant === "footer" ? 56 : 28,
  textClassName,
}: Props) {
  const img = (
    <img src={iconSrc} alt="ZingLots logo" width={size} height={size} className="block" />
  );

  if (variant === "footer") {
    return <div className={`flex flex-col items-center ${className}`}>{img}</div>;
  }

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="ZingLots.com home">
      {img}
      {!iconOnly && (
        <span className={textClassName ?? "text-black text-lg md:text-xl font-extrabold tracking-tight"}>
          ZingLots.com
        </span>
      )}
    </Link>
  );
}