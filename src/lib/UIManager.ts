// UI management for toolbar, buttons, and event handling
export class UIManager {
  private parsedContainer: HTMLDivElement | null = null
  private rawContainer: HTMLDivElement | null = null
  private breadcrumbManager: any // Will be properly typed when imported

  constructor(breadcrumbManager: any) {
    this.breadcrumbManager = breadcrumbManager
  }

  createToolbar(): void {
    // Toolbar removed - no longer needed
  }



  setupContainers(originalPreElement: HTMLPreElement): void {
    // Create main container for parsed JSON and breadcrumb
    const mainContainer = document.createElement('div')
    mainContainer.id = 'jsonFormatterMain'
    mainContainer.style.cssText = 'display: flex; flex-direction: column;'

    // Create containers
    this.parsedContainer = document.createElement('div')
    this.parsedContainer.id = 'jsonFormatterParsed'

    this.rawContainer = document.createElement('div')
    this.rawContainer.hidden = true
    this.rawContainer.id = 'jsonFormatterRaw'
    this.rawContainer.appendChild(originalPreElement)

    // Add parsed container to main container
    mainContainer.appendChild(this.parsedContainer)

    document.body.appendChild(mainContainer)
    document.body.appendChild(this.rawContainer)
  }

  addEventListeners(): void {
    // Add document-wide click handler for expand/collapse and breadcrumb updates
    document.addEventListener('click', this.handleDocumentClick.bind(this))
  }

  private handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    if (!target) return

    // Handle expand/collapse clicks
    if (target.className === 'e') {
      event.preventDefault()
      this.handleExpandCollapse(target, event)
      return
    }

    // Handle entry clicks for breadcrumb updates
    if (target.classList.contains('entry') || target.closest('.entry')) {
      const entryElement = target.classList.contains('entry') ? target : target.closest('.entry') as HTMLElement
      if (entryElement) {
        this.breadcrumbManager.updateBreadcrumb(entryElement)
      }
      return
    }

    // Handle value clicks (s, n, bl, nl classes)
    if (target.classList.contains('s') || target.classList.contains('n') || 
        target.classList.contains('bl') || target.classList.contains('nl')) {
      const entryElement = target.closest('.entry') as HTMLElement
      if (entryElement) {
        this.breadcrumbManager.updateBreadcrumb(entryElement)
      }
      return
    }

    // Handle key clicks
    if (target.classList.contains('k')) {
      const entryElement = target.closest('.entry') as HTMLElement
      if (entryElement) {
        this.breadcrumbManager.updateBreadcrumb(entryElement)
      }
      return
    }
  }

  private handleExpandCollapse(expander: HTMLElement, event: MouseEvent): void {
    const parent = expander.parentElement
    if (!parent || !(parent instanceof HTMLElement)) return

    if (parent.classList.contains('collapsed')) {
      // Expand
      if (event.metaKey || event.ctrlKey) {
        const grandParent = parent.parentElement
        if (grandParent) this.expandAll(grandParent.children)
      } else {
        this.expand([parent])
      }
    } else {
      // Collapse
      if (event.metaKey || event.ctrlKey) {
        const grandParent = parent.parentElement
        if (grandParent) this.collapseAll(grandParent.children)
      } else {
        this.collapse([parent])
      }
    }
  }

  private expand(elements: HTMLElement[] | HTMLCollection): void {
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i]
      if (element instanceof HTMLElement) {
        element.classList.remove('collapsed')
      }
    }
  }

  private collapse(elements: HTMLElement[] | HTMLCollection): void {
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i]
      if (element instanceof HTMLElement) {
        element.classList.add('collapsed')
      }
    }
  }

  private expandAll(elements: HTMLCollection): void {
    this.expand(elements)
  }

  private collapseAll(elements: HTMLCollection): void {
    this.collapse(elements)
  }

  setupBreadcrumbNavigation(): void {
    // Add scroll event listener to update breadcrumb based on visible elements
    const parsedContainer = document.getElementById('jsonFormatterParsed')
    if (!parsedContainer) return

    // Use Intersection Observer to track which element is most visible
    const observer = new IntersectionObserver((entries) => {
      let mostVisibleEntry: Element | null = null
      let maxRatio = 0

      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio
          mostVisibleEntry = entry.target
        }
      })

      if (mostVisibleEntry && (mostVisibleEntry as HTMLElement).classList.contains('entry')) {
        this.breadcrumbManager.updateBreadcrumb(mostVisibleEntry as HTMLElement)
      }
    }, {
      threshold: 0.1,
      rootMargin: '-20% 0px -20% 0px'
    })

    // Observe all entry elements
    const entries = parsedContainer.querySelectorAll('.entry')
    entries.forEach(entry => observer.observe(entry))
  }

  hideExistingFormatters(): void {
    const existingFormatters = document.getElementsByClassName('json-formatter-container')
    for (const element of existingFormatters) {
      if (element instanceof HTMLElement) {
        element.style.display = 'none'
      }
    }
  }

  getParsedContainer(): HTMLDivElement | null {
    return this.parsedContainer
  }
}
