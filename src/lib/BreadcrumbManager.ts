// Breadcrumb management system
export class BreadcrumbManager {
  private breadcrumbBar: HTMLDivElement | null = null
  private breadcrumbContainer: HTMLDivElement | null = null
  private currentPath: Array<{ key: string; index?: number; type: string }> = []

  constructor() {
    this.setupBreadcrumb()
  }

  private setupBreadcrumb(): void {
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
    this.currentPath = this.buildPath(element)
    this.renderBreadcrumb()
  }

  private buildPath(element: HTMLElement): Array<{ key: string; index?: number; type: string }> {
    const path: Array<{ key: string; index?: number; type: string }> = []
    let current = element

    while (current && current.classList.contains('entry')) {
      const keyElement = current.querySelector('.k')
      const parent = current.parentElement
      
      if (keyElement) {
        const key = keyElement.textContent || ''
        const type = this.getElementType(current)
        const index = this.getElementIndex(current)
        
        path.unshift({
          key,
          index,
          type
        })
      }
      
      current = parent?.closest('.entry') as HTMLElement
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

  private getElementIndex(element: HTMLElement): number | undefined {
    const parent = element.parentElement
    if (!parent) return undefined
    
    const siblings = Array.from(parent.children).filter(child => 
      child.classList.contains('entry')
    )
    
    const index = siblings.indexOf(element)
    return index >= 0 ? index : undefined
  }

  private renderBreadcrumb(): void {
    if (!this.breadcrumbContainer || !this.breadcrumbBar) return

    this.breadcrumbContainer.innerHTML = ''

    if (this.currentPath.length === 0) {
      this.breadcrumbBar.style.display = 'none'
      return
    }

    this.breadcrumbBar.style.display = 'block'

    // Add root indicator
    const rootItem = document.createElement('div')
    rootItem.className = 'breadcrumb-item'
    rootItem.textContent = 'root'
    rootItem.addEventListener('click', () => this.navigateToRoot())
    this.breadcrumbContainer.appendChild(rootItem)

    // Add path items
    this.currentPath.forEach((item, index) => {
      // Add separator
      const separator = document.createElement('span')
      separator.className = 'breadcrumb-separator'
      separator.textContent = ' › '
      this.breadcrumbContainer!.appendChild(separator)

      // Add breadcrumb item
      const breadcrumbItem = document.createElement('div')
      breadcrumbItem.className = 'breadcrumb-item'
      if (index === this.currentPath.length - 1) {
        breadcrumbItem.classList.add('active')
      }

      // Create key span
      const keySpan = document.createElement('span')
      keySpan.className = 'breadcrumb-key'
      keySpan.textContent = item.key
      breadcrumbItem.appendChild(keySpan)

      // Add index if it's an array item
      if (item.index !== undefined) {
        const indexSpan = document.createElement('span')
        indexSpan.className = 'breadcrumb-index'
        indexSpan.textContent = `[${item.index}]`
        breadcrumbItem.appendChild(indexSpan)
      }

      // Add type indicator
      const typeSpan = document.createElement('span')
      typeSpan.className = 'breadcrumb-type'
      typeSpan.textContent = item.type === 'array' ? 'arr' : 'obj'
      breadcrumbItem.appendChild(typeSpan)

      // Add click handler
      breadcrumbItem.addEventListener('click', () => {
        this.navigateToPath(index)
      })

      this.breadcrumbContainer!.appendChild(breadcrumbItem)
    })
  }

  private navigateToRoot(): void {
    // Find the root element and scroll to it
    const rootElement = document.querySelector('#jsonFormatterParsed > .entry')
    if (rootElement) {
      rootElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      this.updateBreadcrumb(rootElement as HTMLElement)
    }
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
      
      const entries = Array.from(currentElement.querySelectorAll('.entry'))
      const matchingEntry = entries.find(entry => {
        const keyElement = entry.querySelector('.k')
        const key = keyElement?.textContent || ''
        
        if (pathItem.index !== undefined) {
          // For array items, check both key and index
          const parent = entry.parentElement
          if (parent) {
            const siblings = Array.from(parent.children).filter(child => 
              child.classList.contains('entry')
            )
            const index = siblings.indexOf(entry)
            return key === pathItem.key && index === pathItem.index
          }
        }
        
        return key === pathItem.key
      })
      
      if (matchingEntry) {
        currentElement = matchingEntry as HTMLElement
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
}
