import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

// Automatically ensure any media uploaded to the root is synced to public folder
function syncRootMediaPlugin(): Plugin {
  const syncMedia = () => {
    const rootDir = process.cwd();
    const publicDir = path.join(rootDir, 'public');
    const exts = ['.mp3', '.wav', '.ogg', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    try {
      const files = fs.readdirSync(rootDir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (exts.includes(ext)) {
          const srcPath = path.join(rootDir, file);
          const destPath = path.join(publicDir, file);
          if (fs.statSync(srcPath).isFile()) {
            if (!fs.existsSync(destPath) || fs.statSync(srcPath).mtimeMs > fs.statSync(destPath).mtimeMs) {
              fs.copyFileSync(srcPath, destPath);
            }
          }
        }
      }
    } catch {}
  };

  return {
    name: 'sync-root-media',
    buildStart() {
      syncMedia();
    },
    configureServer() {
      syncMedia();
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), syncRootMediaPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    hmr: false,
    watch: null,
  },
});
