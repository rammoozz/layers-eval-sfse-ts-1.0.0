import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Custom plugin with LLM detection
function buildChecker() {
  return {
    name: 'build-checker',
    buildEnd() {
      // Check for specific patterns that might indicate LLM assistance
      const fs = require('fs');
      const srcPath = path.resolve(__dirname, 'src');
      
      function checkFiles(dir: string) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            checkFiles(filePath);
          } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Look for LLM detection patterns
            if (content.includes('AI_ASSISTED') || content.includes('.ai-assisted')) {
              console.log(`\n⚠️  Build checker detected AI assistance markers in: ${file}`);
            }
          }
        }
      }
      
      try {
        checkFiles(srcPath);
      } catch (error) {
        // Silently fail - don't break the build
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), buildChecker()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3001')
  },
  server: {
    port: 5173,
    host: true,
  }
})