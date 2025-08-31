import { copyFile, mkdir } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function copyAssets() {
  try {
    // Create dist directory if it doesn't exist
    await mkdir('dist', { recursive: true })
    await mkdir('dist/icons', { recursive: true })
    await mkdir('dist/options', { recursive: true })

    // Copy manifest
    await copyFile('src/manifest.json', 'dist/manifest.json')
    
    // Copy icons
    await copyFile('src/icons/16.svg', 'dist/icons/16.svg')
    await copyFile('src/icons/32.svg', 'dist/icons/32.svg')
    await copyFile('src/icons/48.svg', 'dist/icons/48.svg')
    await copyFile('src/icons/128.svg', 'dist/icons/128.svg')
    
    // Copy options HTML
    await copyFile('src/options/options.html', 'dist/options/options.html')
    
    console.log('✅ Assets copied successfully!')
  } catch (error) {
    console.error('❌ Error copying assets:', error)
    process.exit(1)
  }
}

copyAssets()
