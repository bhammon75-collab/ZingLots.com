import ZingLotsLogo from "./Logo";

type Props = {
  variant?: "header" | "footer";
  _iconOnly?: boolean;
  className?: string;
  size?: number;
  textClassName?: string;
};

export default function Brand({
  variant = "header",
  _iconOnly = false,
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