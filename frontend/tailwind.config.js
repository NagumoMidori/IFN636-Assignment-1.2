module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Dark dashboard palette (from style.png)
        navy: {
          900: '#0a0e1a',  // page background
          800: '#111627',  // sidebar background
          700: '#1a1f36',  // card background
          600: '#242b45',  // card hover / input background
          500: '#2e3650',  // border / divider
        },
        // Accent colors
        accent: {
          purple: '#7c5cfc',
          blue: '#3b82f6',
          cyan: '#22d3ee',
        },
        // Status badge colors (from Figma)
        status: {
          delivered: '#10b981',
          pending: '#f59e0b',
          cancelled: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
