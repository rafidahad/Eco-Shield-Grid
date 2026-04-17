import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: '#0e0e10',
  			foreground: '#e7e4ec',
  			card: {
  				DEFAULT: '#131316',
  				foreground: '#e7e4ec'
  			},
  			popover: {
  				DEFAULT: '#0e0e10',
  				foreground: '#e7e4ec'
  			},
  			primary: {
  				DEFAULT: '#c6c6c7',
  				foreground: '#1e1e1e'
  			},
  			secondary: {
  				DEFAULT: '#909fb4',
  				foreground: '#e7e4ec'
  			},
  			muted: {
  				DEFAULT: '#1f1f24',
  				foreground: '#909fb4'
  			},
  			accent: {
  				DEFAULT: '#1f1f24',
  				foreground: '#e7e4ec'
  			},
  			destructive: {
  				DEFAULT: '#7f2737',
  				foreground: '#ff97a3'
  			},
  			border: '#25252b',
  			input: '#25252b',
  			ring: '#c6c6c7',
  			chart: {
  				'1': '#c5ffc9',
  				'2': '#ec7c8a',
  				'3': '#eab308',
  				'4': '#909fb4',
  				'5': '#c6c6c7'
  			},
  			tactical: {
  				bg: '#0e0e10',
  				surface: '#131316',
  				high: '#1f1f24',
  				accent: '#c5ffc9',
  				error: '#ec7c8a',
  				warning: '#eab308',
  				muted: '#909fb4'
  			}
  		},
  		fontFamily: {
  			headline: [
  				'Space Grotesk',
  				'sans-serif'
  			],
  			body: [
  				'Inter',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'monospace'
  			]
  		},
  		borderRadius: {
  			lg: '0px',
  			md: '0px',
  			sm: '0px'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
