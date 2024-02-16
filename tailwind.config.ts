import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // colors: {
    //   blue: '#2684ff',
    //   dark_blue: '#009de3',
    //   orange: '#f7a02c',
    //   secondary_white: '#fff0db',
    //   gray_light: '#e5e5e5',
    //   white: '#ffffff',
    // },
    fontFamily: {
      sans: ['inter'],
    },
    // extend: {
    //   blur: {
    //     xs: '2px',
    //   },
    // },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
