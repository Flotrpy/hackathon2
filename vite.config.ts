
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure process.env is available for the Gemini API key
    'process.env': process.env
  },
  server: {
    port: 3000,
    open: true
  }
});
