import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'2xl': '1280px'
			}
		},
		extend: {
			colors: {
				// Premium brand design system
				brand: { 
					primary: "#E53935", 
					dark: "#B71C1C" 
				},
				ink: "#0F172A",
				paper: "#FAFAFA",
				line: "#E5E7EB",
				
				// New professional design system (existing)
				bg: {
					DEFAULT: '#0B0C0E',
					light: '#F8FAFC'
				},
				surface: {
					DEFAULT: '#111316',
					light: '#FFFFFF'
				},
				text: {
					DEFAULT: '#E7EAF0',
					muted: '#A5ACB8',
					dark: '#0B0C0E',
					darkMuted: '#64748B'
				},
				accent: '#22C55E',
				warn: '#F59E0B',
				danger: '#EF4444',

				// Legacy shadcn tokens (for compatibility)
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
				zing: {
					50:  '#FFF3EC',
					100: '#FFE4D2',
					200: '#FFC3A3',
					300: '#FFA26F',
					400: '#FF8646',
					500: '#FF6B1A',
					600: '#E25E14',
					700: '#B94C12',
					800: '#8F3C14',
					900: '#6F2F13',
				},
				success: '#16A34A',
				warning: '#F59E0B',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				sans: ['Inter','system-ui','Segoe UI','Arial','sans-serif'],
			},
			borderRadius: {
				xl: "18px",
				lg: "12px",
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '16px',
			},
			boxShadow: {
				// Premium shadows
				card: "0 8px 24px rgba(17,24,39,.06)",
				cardHover: "0 10px 30px rgba(17,24,39,.10)",
				
				// Professional design system shadows (existing)
				inset: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
				
				// Legacy shadows (for compatibility)
				glow: '0 0 0 3px rgba(255,107,26,0.25)',
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-soft': 'pulse 2s ease-in-out infinite',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;