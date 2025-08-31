import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content.entry.ts'),
        options: resolve(__dirname, 'src/options/options.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return '[name].[ext]'
          }
          return '[name].[ext]'
        }
      }
    },
    assetsInlineLimit: 0
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    modules: false
  },
  plugins: [
    {
      name: 'css-imports',
      transform(code, id) {
        if (id.endsWith('.css')) {
          return {
            code: `export default ${JSON.stringify(code)}`,
            map: null
          }
        }
      }
    }
  ]
})
