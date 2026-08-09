/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                fontFamily: {
                        serif: ["Merriweather", "Georgia", "serif"],
                        sans: ["'IBM Plex Sans'", "system-ui", "sans-serif"],
                        mono: ["JetBrains Mono", "monospace"],
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        gov: {
                                navy: '#0d2f5a',
                                blue: '#1a5fb4',
                                blueDark: '#154c90',
                                ink: '#0f172a',
                                charcoal: '#334155',
                                slate: '#475569',
                                mist: '#f4f5f7',
                                line: '#e2e8f0',
                                green: '#1f7a4d',
                                greenLight: '#26a269',
                                amber: '#e5a50a',
                                red: '#b3261e'
                        },
                        brand: {
                                forest: '#1a5fb4',
                                terracotta: '#26a269',
                                wheat: '#e5a50a',
                                bone: '#f5f6fb',
                                slate: '#0d2f5a',
                                muted: '#475569',
                                red: '#b3261e',
                                purple: '#0d2f5a'
                        },
                        highlight: '#E9E4D2',
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                keyframes: {
                        'accordion-down': {
                                from: { height: '0' },
                                to: { height: 'var(--radix-accordion-content-height)' }
                        },
                        'accordion-up': {
                                from: { height: 'var(--radix-accordion-content-height)' },
                                to: { height: '0' }
                        },
                        'gov-fade-up': {
                                from: { opacity: '0', transform: 'translateY(8px)' },
                                to: { opacity: '1', transform: 'translateY(0)' }
                        },
                        'gov-fade': {
                                from: { opacity: '0' },
                                to: { opacity: '1' }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'fade-up': 'gov-fade-up 0.5s ease-out both',
                        'fade': 'gov-fade 0.5s ease-out both'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};
