import { Link } from "react-router-dom";
import ZingLotsLogo from "./Logo";

type Props = {
  variant?: "header" | "footer";
  iconOnly?: boolean;
  className?: string;
  size?: number;
  textClassName?: string;
};

export default function Brand({
  variant = "header",
  iconOnly = false,
  className = "",
  size = variant === "footer" ? 56 : 32,
  textClassName,
}: Props) {
  // Use the new logo component
  if (variant === "footer") {
    return (
      <div className={className}>
        <ZingLotsLogo size={size} variant="white" className="justify-start" />
      </div>
    );
  }

  return (
    <ZingLotsLogo size={size} variant="primary" className={className} textClassName={textClassName} />
  );
}