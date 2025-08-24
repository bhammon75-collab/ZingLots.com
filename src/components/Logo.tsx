export default function ZingLotsLogo({ 
  size = 32, 
  className = "",
  variant = "primary" // "primary", "white", "flexible" 
}: {
  size?: number;
  className?: string;
  variant?: "primary" | "white" | "flexible";
}) {
  const colors = {
    primary: "#0f172a",
    white: "#ffffff",
    flexible: "currentColor"
  };
  
  const color = colors[variant];
  
  return (
    <a href="/" className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="none" 
          stroke={color} 
          strokeWidth="8"
        />
        <path 
          d="M25 35 L75 35 L45 50 L75 65 L25 65 L55 50 Z" 
          fill={color}
        />
      </svg>
      
      <div className="flex items-baseline">
        <span className="font-extrabold tracking-tight">
          Z<span style={{ color: '#2563eb' }}>i</span>ng
        </span>
        <span className="font-bold tracking-tight">
          L<span style={{ color: '#dc2626' }}>o</span>ts
        </span>
        <span className="ml-1 font-medium opacity-70 text-sm">
          .c<span style={{ color: '#dc2626' }}>o</span>m
        </span>
      </div>
    </a>
  );
}