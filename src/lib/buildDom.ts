// Modern JSON DOM builder - Refactored for maintainability and 2026 features
import { JsonArray, JsonObject, JsonValue } from './types'
import { EntryBuilder } from './builders/EntryBuilder'

/**
 * Recursively builds a style-able DOM tree of nested spans, based on a JSON value
 * 
 * Enhanced for 2026 with:
 * - Modular architecture
 * - Better performance for large objects
 * - Modern interaction patterns
 * - Accessibility improvements
 * - Advanced styling hooks
 * 
 * @param value Any JSON-compatible value (object, array, or primitive)
 * @param keyName The key for this value if it's an object entry, or false if it's not
 * @param options Additional options for enhanced rendering
 * @returns The generated DOM tree
 */
export const buildDom = (
  value: JsonValue,
  keyName: string | false = false,
  options: {
    lazy?: boolean
    maxDepth?: number
    enableInteractions?: boolean
  } = {}
): HTMLSpanElement => {
  const { lazy = false, maxDepth = 15, enableInteractions = true } = options
  
  const entry = EntryBuilder.buildEntryOptimized(value, keyName, {
    depth: 0,
    lazy,
    maxDepth
  })
  
  // Add modern interaction patterns
  if (enableInteractions) {
    addEnhancedInteractions(entry)
  }
  
  return entry
}

/**
 * Legacy compatibility function
 * @deprecated Use buildDom with options instead
 */
export const buildDomLegacy = (
  value: JsonObject | JsonArray,
  keyName: string | false
): HTMLSpanElement => {
  return buildDom(value, keyName, { lazy: false, enableInteractions: true })
}

/**
 * Add enhanced 2026 interaction patterns
 */
function addEnhancedInteractions(rootEntry: HTMLSpanElement): void {
  // Add hover effects for better UX
  rootEntry.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('entry')) {
      target.setAttribute('data-hovered', 'true')
    }
  })
  
  rootEntry.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('entry')) {
      target.removeAttribute('data-hovered')
    }
  })
  
  // Add click-to-copy functionality
  rootEntry.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('s') && e.ctrlKey) { // Ctrl+click to copy strings
      e.preventDefault()
      copyToClipboard(target.textContent || '')
    }
  })
  
  // Add keyboard navigation
  rootEntry.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      handleKeyboardNavigation(e)
    }
  })
}

/**
 * Copy text to clipboard with user feedback
 */
function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).then(() => {
    // Show brief success indication
    const notification = document.createElement('div')
    notification.textContent = 'Copied!'
    notification.className = 'copy-notification'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.remove()
    }, 2000)
  }).catch(() => {
    console.warn('Failed to copy to clipboard')
  })
}

/**
 * Handle keyboard navigation between JSON nodes
 */
function handleKeyboardNavigation(e: KeyboardEvent): void {
  e.preventDefault()
  const target = e.target as HTMLElement
  const entry = target.closest('.entry') as HTMLElement
  
  if (!entry) return
  
  if (e.key === 'ArrowRight') {
    // Expand or move to next sibling
    if (entry.classList.contains('collapsed')) {
      const expander = entry.querySelector('.e') as HTMLElement
      if (expander) {
        expander.click()
      }
    } else {
      const nextEntry = findNextEntry(entry)
      if (nextEntry) {
        nextEntry.focus()
      }
    }
  } else if (e.key === 'ArrowLeft') {
    // Collapse or move to parent
    if (!entry.classList.contains('collapsed')) {
      const expander = entry.querySelector('.e') as HTMLElement
      if (expander) {
        expander.click()
      }
    } else {
      const parentEntry = findParentEntry(entry)
      if (parentEntry) {
        parentEntry.focus()
      }
    }
  }
}

/**
 * Find the next navigable entry
 */
function findNextEntry(currentEntry: HTMLElement): HTMLElement | null {
  const allEntries = Array.from(document.querySelectorAll('.entry'))
  const currentIndex = allEntries.indexOf(currentEntry)
  
  if (currentIndex >= 0 && currentIndex < allEntries.length - 1) {
    return allEntries[currentIndex + 1] as HTMLElement
  }
  
  return null
}

/**
 * Find the parent entry
 */
function findParentEntry(currentEntry: HTMLElement): HTMLElement | null {
  const parent = currentEntry.parentElement?.closest('.entry')
  return parent as HTMLElement | null
}