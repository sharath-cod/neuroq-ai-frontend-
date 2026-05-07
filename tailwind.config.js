// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        clinical: {
          blue: '#0066b4',
          teal: '#0891b2',
          light: '#f0f4f8',
          card: '#ffffff',
          border: '#d1dce8',
          muted: '#64748b',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':  'spin 3s linear infinite'
      }
    }
  },
  plugins: []
};
