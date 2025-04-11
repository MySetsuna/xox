import type { Config } from 'tailwindcss';
const tailwindConfig: Config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'red-a12': 'var(--red-a12)',
        'red-a5': 'var(--red-a5)',
        'red-a2': 'var(--red-a2)',
      },
    },
  },
  plugins: [],
};
export default tailwindConfig;
