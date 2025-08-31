import './lib/beforeAll'

import { buildDom } from './lib/buildDom'
import { JsonArray, JsonObject, JsonValue } from './lib/types'
import { ThemeManager } from './lib/ThemeManager'
import { BreadcrumbManager } from './lib/BreadcrumbManager'
import { UIManager } from './lib/UIManager'

const PERFORMANCE_DEBUGGING = false

// Enhanced JSON formatter with modern features
class JSONFormatterPro {
  private themeManager: ThemeManager
  private breadcrumbManager: BreadcrumbManager
  private uiManager: UIManager
  private originalPreElement: HTMLPreElement | null = null

  constructor() {
    this.themeManager = ThemeManager.getInstance()
    this.breadcrumbManager = new BreadcrumbManager()
    this.uiManager = new UIManager(this.breadcrumbManager)
  }

  async initialize(): Promise<{
    formatted: boolean
    note: string
    rawLength: number | null
  }> {
    try {
      // Find the original pre element
      this.originalPreElement = this.findPreElement()
      if (!this.originalPreElement) {
        return { formatted: false, note: 'No body>pre found', rawLength: null }
      }

      const rawContent = this.originalPreElement.textContent
      if (!rawContent) {
        return { formatted: false, note: 'No content in body>pre', rawLength: 0 }
      }

      const rawLength = rawContent.length
      if (rawLength > 3000000) {
        return { formatted: false, note: 'Too long', rawLength }
      }

      if (!/^\s*[\{\[]/.test(rawContent)) {
        return { formatted: false, note: 'Does not start with { or [', rawLength }
      }

      // Parse JSON
      let parsedJson: JsonValue
      try {
        parsedJson = JSON.parse(rawContent)
      } catch (e) {
        return { formatted: false, note: 'Does not parse as JSON', rawLength }
      }

      if (typeof parsedJson !== 'object' && !Array.isArray(parsedJson)) {
        return {
          formatted: false,
          note: 'Technically JSON but not an object or array',
          rawLength,
        }
      }

      // Setup UI
      await this.setupUI()
      
      // Format and display
      const rootEntry = buildDom(parsedJson as JsonObject | JsonArray, false)
      const parsedContainer = this.uiManager.getParsedContainer()
      parsedContainer?.appendChild(rootEntry)

      // Add theme attribute for CSS
      const theme = await this.themeManager.getTheme()
      document.documentElement.setAttribute('data-theme', theme)

      // Setup breadcrumb navigation
      this.uiManager.setupBreadcrumbNavigation()

      return { formatted: true, note: 'done', rawLength }

    } catch (error) {
      console.error('JSON Formatter Pro error:', error)
      return { formatted: false, note: 'Unexpected error', rawLength: null }
    }
  }

  private findPreElement(): HTMLPreElement | null {
    const bodyChildren = document.body.children
    for (let i = 0; i < bodyChildren.length; i++) {
      const child = bodyChildren[i]
      if (child.tagName === 'PRE') return child as HTMLPreElement
    }
    return null
  }

  private async setupUI(): Promise<void> {
    if (!this.originalPreElement) return

    // Remove original pre element
    this.originalPreElement.remove()

    // Setup containers
    this.uiManager.setupContainers(this.originalPreElement)

    // Add styles
    await this.addStyles()

    // Create toolbar
    this.uiManager.createToolbar()

    // Add event listeners
    this.uiManager.addEventListeners()

    // Hide existing formatters
    this.uiManager.hideExistingFormatters()
  }

  private async addStyles(): Promise<void> {
    const styleElement = document.createElement('style')
    styleElement.id = 'jfStyleEl'
    styleElement.textContent = this.themeManager.getCSS()
    document.head.appendChild(styleElement)
  }
}

// Initialize the formatter
const formatter = new JSONFormatterPro()
const resultPromise = formatter.initialize()

// Performance debugging
if (PERFORMANCE_DEBUGGING) {
  resultPromise.then((result) => {
    const startTime = (window as any).__jsonFormatterStartTime as number
    const endTime = performance.now()
    const duration = endTime - startTime

    console.log('JSON Formatter Pro', result)
    console.log('Duration:', Math.round(duration * 10) / 10, 'ms')
  })
}
