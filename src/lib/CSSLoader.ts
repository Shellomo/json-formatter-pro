// CSS module loader for better organization and performance
export class CSSLoader {
  private static cssCache = new Map<string, string>()

  static async loadCSS(moduleName: string): Promise<string> {
    if (this.cssCache.has(moduleName)) {
      return this.cssCache.get(moduleName)!
    }

    try {
      const response = await fetch(chrome.runtime.getURL(`styles/${moduleName}.css`))
      const css = await response.text()
      this.cssCache.set(moduleName, css)
      return css
    } catch (error) {
      console.warn(`Failed to load CSS module: ${moduleName}`, error)
      return ''
    }
  }

  static async loadMultiple(moduleNames: string[]): Promise<string> {
    const cssPromises = moduleNames.map(name => this.loadCSS(name))
    const cssResults = await Promise.all(cssPromises)
    return cssResults.join('\n\n')
  }

  static clearCache(): void {
    this.cssCache.clear()
  }
}