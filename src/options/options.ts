// Modern Options Page for JSON Formatter Pro

interface Settings {
  themeOverride: string
  performanceMode: boolean
  autoExpandArrays: boolean
  showLineNumbers: boolean
}

class OptionsManager {
  private defaultSettings: Settings = {
    themeOverride: 'system',
    performanceMode: false,
    autoExpandArrays: true,
    showLineNumbers: false
  }

  constructor() {
    this.initialize()
  }

  private async initialize(): Promise<void> {
    try {
      await this.loadSettings()
      this.setupEventListeners()
      this.showStatus('Settings loaded successfully!', 'success')
    } catch (error) {
      console.error('Failed to initialize options:', error)
      this.showStatus('Failed to load settings', 'error')
    }
  }

  private async loadSettings(): Promise<void> {
    const result = await chrome.storage.local.get(null)
    const settings = { ...this.defaultSettings, ...result }

    // Set theme radio button
    const themeInput = document.querySelector(`input[name="theme"][value="${settings.themeOverride}"]`) as HTMLInputElement
    if (themeInput) themeInput.checked = true

    // Set checkboxes
    const performanceMode = document.getElementById('performance-mode') as HTMLInputElement
    const autoExpandArrays = document.getElementById('auto-expand-arrays') as HTMLInputElement
    const showLineNumbers = document.getElementById('show-line-numbers') as HTMLInputElement

    if (performanceMode) performanceMode.checked = settings.performanceMode
    if (autoExpandArrays) autoExpandArrays.checked = settings.autoExpandArrays
    if (showLineNumbers) showLineNumbers.checked = settings.showLineNumbers
  }

  private setupEventListeners(): void {
    // Theme radio buttons
    const themeInputs = document.querySelectorAll('input[name="theme"]')
    themeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement
        this.saveSetting('themeOverride', target.value)
      })
    })

    // Checkboxes
    const performanceMode = document.getElementById('performance-mode') as HTMLInputElement
    const autoExpandArrays = document.getElementById('auto-expand-arrays') as HTMLInputElement
    const showLineNumbers = document.getElementById('show-line-numbers') as HTMLInputElement

    performanceMode?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      this.saveSetting('performanceMode', target.checked)
    })

    autoExpandArrays?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      this.saveSetting('autoExpandArrays', target.checked)
    })

    showLineNumbers?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      this.saveSetting('showLineNumbers', target.checked)
    })

    // Action buttons
    const resetButton = document.getElementById('reset-settings')
    const exportButton = document.getElementById('export-settings')
    const importButton = document.getElementById('import-settings')
    const reportIssueButton = document.getElementById('report-issue')

    resetButton?.addEventListener('click', () => this.resetSettings())
    exportButton?.addEventListener('click', () => this.exportSettings())
    importButton?.addEventListener('click', () => this.importSettings())
    reportIssueButton?.addEventListener('click', () => this.reportIssue())
  }

  private async saveSetting(key: keyof Settings, value: any): Promise<void> {
    try {
      await chrome.storage.local.set({ [key]: value })
      this.showStatus('Setting saved successfully!', 'success')
    } catch (error) {
      console.error('Failed to save setting:', error)
      this.showStatus('Failed to save setting', 'error')
    }
  }

  private async resetSettings(): Promise<void> {
    try {
      await chrome.storage.local.clear()
      await chrome.storage.local.set(this.defaultSettings)
      await this.loadSettings()
      this.showStatus('Settings reset to defaults!', 'success')
    } catch (error) {
      console.error('Failed to reset settings:', error)
      this.showStatus('Failed to reset settings', 'error')
    }
  }

  private async exportSettings(): Promise<void> {
    try {
      const settings = await chrome.storage.local.get(null)
      const dataStr = JSON.stringify(settings, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'json-formatter-pro-settings.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      this.showStatus('Settings exported successfully!', 'success')
    } catch (error) {
      console.error('Failed to export settings:', error)
      this.showStatus('Failed to export settings', 'error')
    }
  }

  private async importSettings(): Promise<void> {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.json'
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return

        const text = await file.text()
        const settings = JSON.parse(text)
        
        await chrome.storage.local.clear()
        await chrome.storage.local.set(settings)
        await this.loadSettings()
        
        this.showStatus('Settings imported successfully!', 'success')
      }
      
      input.click()
    } catch (error) {
      console.error('Failed to import settings:', error)
      this.showStatus('Failed to import settings', 'error')
    }
  }

  private reportIssue(): void {
    const url = 'https://github.com/json-formatter-pro/issues/new'
    chrome.tabs.create({ url })
  }

  private showStatus(message: string, type: 'success' | 'error'): void {
    const statusElement = document.getElementById('status') as HTMLElement
    if (!statusElement) return

    statusElement.textContent = message
    statusElement.className = `status ${type}`
    statusElement.style.display = 'block'

    // Auto-hide after 3 seconds
    setTimeout(() => {
      statusElement.style.display = 'none'
    }, 3000)
  }
}

// Initialize the options manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager()
})

// Add some modern UI enhancements
document.addEventListener('DOMContentLoaded', () => {
  // Add smooth transitions to cards
  const cards = document.querySelectorAll('.card')
  cards.forEach((card, index) => {
    const cardElement = card as HTMLElement
    cardElement.style.opacity = '0'
    cardElement.style.transform = 'translateY(20px)'
    
    setTimeout(() => {
      cardElement.style.transition = 'all 0.3s ease-out'
      cardElement.style.opacity = '1'
      cardElement.style.transform = 'translateY(0)'
    }, index * 100)
  })

  // Add hover effects to buttons
  const buttons = document.querySelectorAll('.button')
  buttons.forEach(button => {
    const buttonElement = button as HTMLElement
    buttonElement.addEventListener('mouseenter', () => {
      buttonElement.style.transform = 'translateY(-2px)'
    })
    
    buttonElement.addEventListener('mouseleave', () => {
      buttonElement.style.transform = 'translateY(0)'
    })
  })
})
