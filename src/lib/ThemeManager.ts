import { CSSLoader } from './CSSLoader'

// Modern theme management with modular CSS loading
export class ThemeManager {
  private static instance: ThemeManager
  private currentTheme: string = 'system'
  private cssCache: string = ''
  private readonly cssModules = [
    'variables',
    'base',
    'breadcrumb',
    'json-structure',
    'syntax-highlighting'
  ]

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  async getTheme(): Promise<string> {
    return new Promise((resolve) => {
      chrome.storage.local.get('themeOverride', (result) => {
        this.currentTheme = result.themeOverride || 'system'
        resolve(this.currentTheme)
      })
    })
  }

  async setTheme(theme: string): Promise<void> {
    this.currentTheme = theme
    return new Promise((resolve) => {
      chrome.storage.local.set({ themeOverride: theme }, resolve)
    })
  }

  async getCSS(): Promise<string> {
    if (!this.cssCache) {
      await this.loadCSS()
    }
    
    let css = this.cssCache
    
    // Add dark theme CSS based on theme setting
    switch (this.currentTheme) {
      case 'force_dark':
        css += '\n\n' + await CSSLoader.loadCSS('dark-theme')
        break
      case 'system':
        css += '\n\n' + await CSSLoader.loadCSS('dark-theme')
        break
      // force_light uses only the base CSS
    }
    
    return css
  }

  private async loadCSS(): Promise<void> {
    this.cssCache = await CSSLoader.loadMultiple(this.cssModules)
  }

  // Refresh CSS cache when theme changes
  async refreshCSS(): Promise<void> {
    CSSLoader.clearCache()
    this.cssCache = ''
    await this.loadCSS()
  }

  // Get theme-specific styling attributes
  getThemeDataAttribute(): string {
    switch (this.currentTheme) {
      case 'force_dark':
        return 'force_dark'
      case 'force_light':
        return 'light'
      case 'system':
      default:
        return 'system'
    }
  }
}
