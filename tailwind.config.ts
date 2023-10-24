import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      blue: '#2684ff',
      dark_blue: '#009de3',
      orange: '#f7a02c',
      secondary_white: '#fff0db',
      gray_light: '#e5e5e5',
      white: '#ffffff',
    },
    fontFamily: {
      sans: ['inter'],
    },
    extend: {
      blur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
