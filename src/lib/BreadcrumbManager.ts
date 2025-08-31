// Enhanced Breadcrumb management system for 2026
export class BreadcrumbManager {
  private breadcrumbBar: HTMLDivElement | null = null
  private breadcrumbContainer: HTMLDivElement | null = null
  private currentPath: Array<{ key: string; index?: number; type: string; element?: HTMLElement }> = []
  private history: Array<{ key: string; index?: number; type: string }[]> = []
  private historyIndex: number = -1
  private maxHistorySize: number = 50

  constructor() {
    this.setupBreadcrumb()
  }

  private setupBreadcrumb(): void {
    // Check if breadcrumb already exists and remove it to avoid duplicates
    const existingBreadcrumb = document.getElementById('breadcrumbBar')
    if (existingBreadcrumb) {
      existingBreadcrumb.remove()
    }

    // Create breadcrumb bar
    this.breadcrumbBar = document.createElement('div')
    this.breadcrumbBar.id = 'breadcrumbBar'
    this.breadcrumbBar.style.display = 'none' // Hidden by default

    // Create breadcrumb container
    this.breadcrumbContainer = document.createElement('div')
    this.breadcrumbContainer.className = 'breadcrumb-container'

    this.breadcrumbBar.appendChild(this.breadcrumbContainer)
    
    // Find the main container and append breadcrumb to it
    const mainContainer = document.getElementById('jsonFormatterMain')
    if (mainContainer) {
      mainContainer.appendChild(this.breadcrumbBar)
    } else {
      // Fallback to body if main container not found
      document.body.appendChild(this.breadcrumbBar)
    }
  }

  updateBreadcrumb(element: HTMLElement): void {
    const newPath = this.buildPath(element)
    
    // Only update if path has actually changed
    if (!this.pathsEqual(this.currentPath, newPath)) {
      // Add current path to history
      if (this.currentPath.length > 0) {
        this.addToHistory(this.currentPath)
      }
      
      this.currentPath = newPath
      this.renderBreadcrumb()
      
      // Emit path change event
      this.emitPathChangeEvent()
    }
  }

  private buildPath(element: HTMLElement): Array<{ key: string; index?: number; type: string; element?: HTMLElement }> {
    const path: Array<{ key: string; index?: number; type: string; element?: HTMLElement }> = []
    let current = element

    while (current && current.classList.contains('entry')) {
      const isArrayItem = current.hasAttribute('data-array-index')
      
      if (isArrayItem) {
        // For array items, get the index from data-index attribute
        const index = parseInt(current.getAttribute('data-index') || '0', 10)
        path.unshift({
          key: `[${index}]`, // Display as [index]
          index,
          type: 'array-item',
          element: current
        })
      } else {
        // For object properties, get the key from the key element
        const keyElement = current.querySelector('.k')
        if (keyElement) {
          const keyText = keyElement.textContent?.replace(/["|']/g, '') || ''
          const type = this.getElementType(current)
          path.unshift({
            key: keyText,
            type,
            element: current
          })
        }
      }
      
      // Move up to parent entry
      const parent = current.parentElement?.closest('.entry') as HTMLElement
      current = parent
    }

    return path
  }

  private getElementType(element: HTMLElement): string {
    const parent = element.parentElement
    if (!parent) return 'root'
    
    // Check if it's an array item
    const prevSibling = element.previousElementSibling
    if (prevSibling && prevSibling.classList.contains('entry')) {
      return 'array'
    }
    
    // Check if it's an object property
    const blockInner = parent.querySelector('.blockInner')
    if (blockInner && blockInner.contains(element)) {
      return 'object'
    }
    
    return 'root'
  }


  private renderBreadcrumb(): void {
    if (!this.breadcrumbContainer || !this.breadcrumbBar) return

    this.breadcrumbContainer.innerHTML = ''

    if (this.currentPath.length === 0) {
      this.breadcrumbBar.style.display = 'none'
      return
    }

    this.breadcrumbBar.style.display = 'block'

    // Add path items in clean format: key → another_key → [0] → key → [5]
    this.currentPath.forEach((item, index) => {
      // Add separator before each item except the first
      if (index > 0) {
        const separator = document.createElement('span')
        separator.className = 'breadcrumb-separator'
        separator.textContent = ' → '
        this.breadcrumbContainer!.appendChild(separator)
      }

      // Add breadcrumb item
      const breadcrumbItem = this.createSimpleBreadcrumbItem(item, index)
      this.breadcrumbContainer!.appendChild(breadcrumbItem)
    })
  }


  private navigateToPath(pathIndex: number): void {
    // Find the element at the specified path level
    const targetPath = this.currentPath.slice(0, pathIndex + 1)
    const targetElement = this.findElementByPath(targetPath)
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.updateBreadcrumb(targetElement)
    }
  }

  private findElementByPath(path: Array<{ key: string; index?: number; type: string }>): HTMLElement | null {
    let currentElement = document.querySelector('#jsonFormatterParsed > .entry') as HTMLElement
    
    for (const pathItem of path) {
      if (!currentElement) break
      
      const blockInner = currentElement.querySelector('.blockInner')
      if (!blockInner) break
      
      const entries = Array.from(blockInner.children).filter(child => 
        child.classList.contains('entry')
      ) as HTMLElement[]
      
      const matchingEntry = entries.find(entry => {
        const isArrayItem = entry.hasAttribute('data-array-index')
        
        if (pathItem.type === 'array-item' && isArrayItem) {
          // For array items, compare using the data-index attribute
          const entryIndex = parseInt(entry.getAttribute('data-index') || '0', 10)
          return pathItem.index === entryIndex
        } else if (!isArrayItem) {
          // For object properties, compare keys directly
          const keyElement = entry.querySelector('.k')
          const keyText = keyElement?.textContent?.replace(/["|']/g, '') || ''
          return keyText === pathItem.key
        }
        
        return false
      })
      
      if (matchingEntry) {
        currentElement = matchingEntry
      } else {
        return null
      }
    }
    
    return currentElement
  }

  hideBreadcrumb(): void {
    if (this.breadcrumbBar) {
      this.breadcrumbBar.style.display = 'none'
    }
  }

  // Enhanced 2026 features
  private pathsEqual(path1: any[], path2: any[]): boolean {
    if (path1.length !== path2.length) return false
    return path1.every((item, index) => {
      const other = path2[index]
      return item.key === other.key && item.index === other.index && item.type === other.type
    })
  }

  private addToHistory(path: any[]): void {
    // Remove future history if we're not at the end
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1)
    }

    this.history.push([...path])
    this.historyIndex = this.history.length - 1

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
      this.historyIndex--
    }
  }

  private emitPathChangeEvent(): void {
    const event = new CustomEvent('breadcrumb-path-change', {
      detail: {
        path: this.currentPath,
        pathString: this.getPathString()
      },
      bubbles: true
    })
    document.dispatchEvent(event)
  }

  private createSimpleBreadcrumbItem(item: any, index: number): HTMLSpanElement {
    const breadcrumbItem = document.createElement('span')
    breadcrumbItem.className = 'breadcrumb-item'
    breadcrumbItem.textContent = item.key
    
    // Make it clickable to navigate to that path level
    breadcrumbItem.style.cursor = 'pointer'
    breadcrumbItem.addEventListener('click', () => {
      this.navigateToPath(index)
    })

    return breadcrumbItem
  }

  private getPathString(): string {
    return this.currentPath
      .map(item => item.key)
      .join(' → ')
  }

}
