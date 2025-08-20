import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./index.html","./src/**/*.{ts,tsx,js,jsx,vue,svelte,astro,html}","./components/**/*.{ts,tsx,js,jsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary:{ DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive:{ DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted:{ DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent:{ DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover:{ DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card:{ DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        brand:{ 
          blue:"hsl(var(--brand-blue))", 
          "blue-foreground":"hsl(var(--brand-blue-foreground))",
          red: "#E53935",
          "red-dark": "#C62828",
          "red-light": "#EF5350",
          primary: "#E53935",
          dark: "#111111"
        },
        zing:{50:"#F1F8FC",100:"#E8F2FA",200:"#D6E8F3",300:"#B4D6EC",400:"#86BDE3",500:"#5EA6DA",600:"#2A99D8",700:"#1E7DB8",800:"#166092",900:"#124D77",950:"#0D3857"},
        ink:{50:"#F8FAFB",100:"#EEF5F8",200:"#DEE9F0",300:"#CBD8E5",400:"#A8BACF",500:"#8DA3BD",600:"#6B869F",700:"#4E6B82",800:"#3A566B",900:"#2A4354",950:"#1E2F3D"},
        success:{ DEFAULT:"#16A34A" }, warning:{ DEFAULT:"#F59E0B" }, error:{ DEFAULT:"#EF4444" }
      },
      borderRadius:{ lg:"var(--radius)", md:"calc(var(--radius) - 2px)", sm:"calc(var(--radius) - 4px)" },
      keyframes:{ "accordion-down":{ from:{height:"0"}, to:{ height:"var(--radix-accordion-content-height)" } }, "accordion-up":{ from:{ height:"var(--radix-accordion-content-height)" }, to:{height:"0"} } },
      animation:{ "accordion-down":"accordion-down 0.2s ease-out", "accordion-up":"accordion-up 0.2s ease-out" }
    }
  },
  plugins:[require("tailwindcss-animate")]
};
export default config;