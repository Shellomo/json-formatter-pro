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
    await mkdir('dist/styles', { recursive: true })

    // Copy manifest
    await copyFile('src/manifest.json', 'dist/manifest.json')
    
    // Copy icons
    await copyFile('src/icons/16.svg', 'dist/icons/16.svg')
    await copyFile('src/icons/32.svg', 'dist/icons/32.svg')
    await copyFile('src/icons/48.svg', 'dist/icons/48.svg')
    await copyFile('src/icons/128.svg', 'dist/icons/128.svg')
    
    // Copy PNG icons
    await copyFile('src/icons/16.png', 'dist/icons/16.png')
    await copyFile('src/icons/32.png', 'dist/icons/32.png')
    await copyFile('src/icons/48.png', 'dist/icons/48.png')
    await copyFile('src/icons/128.png', 'dist/icons/128.png')
    
    // Copy options HTML
    await copyFile('src/options/options.html', 'dist/options/options.html')
    
    // Copy styles
    await copyFile('src/styles/variables.css', 'dist/styles/variables.css')
    await copyFile('src/styles/base.css', 'dist/styles/base.css')
    await copyFile('src/styles/breadcrumb.css', 'dist/styles/breadcrumb.css')
    await copyFile('src/styles/json-structure.css', 'dist/styles/json-structure.css')
    await copyFile('src/styles/syntax-highlighting.css', 'dist/styles/syntax-highlighting.css')
    await copyFile('src/styles/dark-theme.css', 'dist/styles/dark-theme.css')
    
    console.log('✅ Assets copied successfully!')
  } catch (error) {
    console.error('❌ Error copying assets:', error)
    process.exit(1)
  }
}

copyAssets()
