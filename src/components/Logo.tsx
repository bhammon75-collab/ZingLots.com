export default function ZingLotsLogo({ 
  size = 32, 
  className = "",
  variant = "primary", // "primary", "white", "flexible" 
  textClassName = ""
}: {
  size?: number;
  className?: string;
  variant?: "primary" | "white" | "flexible";
  textClassName?: string;
}) {
  const colors = {
    primary: "#0f172a",
    white: "#ffffff",
    flexible: "currentColor"
  };
  
  const color = colors[variant];
  
  return (
    <a href="/" className={`flex items-center ${className}`}>
      <div className={`flex items-baseline ${textClassName}`}>
        <span className="font-extrabold tracking-tight">Zing</span>
        <span className="font-bold tracking-tight">Lots</span>
        <span className="ml-1 font-medium opacity-70 text-sm">.com</span>
      </div>
    </a>
  );
}