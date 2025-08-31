// Collection (object/array) building utilities
import { TYPE_ARRAY, TYPE_OBJECT } from '../constants'
import { templates } from '../templates'
import { JsonArray, JsonObject, JsonValue } from '../types'
import { ValueRenderer } from './ValueRenderer'

export class CollectionBuilder {
  static buildCollection(
    value: JsonObject | JsonArray,
    type: number,
    keyName: string | false,
    buildDomFn: (value: JsonValue, keyName: string | false) => HTMLSpanElement
  ): { entry: HTMLSpanElement; hasChildren: boolean } {
    const entry = templates.t_entry.cloneNode(false) as HTMLSpanElement
    const collectionSize = this.getCollectionSize(value, type)
    
    // Set modern data attributes for enhanced styling
    entry.setAttribute('data-type', type === TYPE_OBJECT ? 'object' : 'array')
    entry.setAttribute('data-size', collectionSize.toString())
    
    // Add key if this is an object property
    if (keyName !== false) {
      const keySpan = ValueRenderer.renderKey(keyName)
      entry.appendChild(keySpan)
    }
    
    // Add opening bracket
    const openBracket = ValueRenderer.renderCollectionBrackets(type, true)
    entry.appendChild(openBracket)
    
    // Check if collection has children
    const hasChildren = this.hasNonZeroSize(value)
    
    if (hasChildren) {
      // Add expander button
      const expander = this.createExpander()
      entry.appendChild(expander)
      
      // Add ellipsis for collapsed state
      const ellipsis = templates.t_ellipsis.cloneNode(false) as HTMLSpanElement
      ellipsis.classList.add('ell')
      entry.appendChild(ellipsis)
      
      // Build children container
      const blockInner = this.buildChildrenContainer(value, type, buildDomFn)
      entry.appendChild(blockInner)
    }
    
    // Add closing bracket
    const closeBracket = ValueRenderer.renderCollectionBrackets(type, false)
    entry.appendChild(closeBracket)
    
    return { entry, hasChildren }
  }
  
  private static getCollectionSize(value: JsonObject | JsonArray, type: number): number {
    if (type === TYPE_OBJECT) {
      return Object.keys(value as JsonObject).length
    } else if (type === TYPE_ARRAY) {
      return (value as JsonArray).length
    }
    return 0
  }
  
  private static hasNonZeroSize(value: JsonObject | JsonArray): boolean {
    for (const _key in value) {
      return true // If we can iterate over at least one key, it's non-empty
    }
    return false
  }
  
  private static createExpander(): HTMLSpanElement {
    const expander = templates.t_expander.cloneNode(false) as HTMLSpanElement
    expander.classList.add('e')
    
    // Enhanced 2026 interaction
    expander.addEventListener('click', (e) => {
      e.stopPropagation()
      const entry = expander.closest('.entry') as HTMLElement
      if (entry) {
        this.toggleCollapsed(entry)
      }
    })
    
    // Add keyboard support
    expander.setAttribute('tabindex', '0')
    expander.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
        const entry = expander.closest('.entry') as HTMLElement
        if (entry) {
          this.toggleCollapsed(entry)
        }
      }
    })
    
    return expander
  }
  
  private static toggleCollapsed(entry: HTMLElement): void {
    const isCurrentlyCollapsed = entry.classList.contains('collapsed')
    
    if (isCurrentlyCollapsed) {
      entry.classList.remove('collapsed')
      entry.setAttribute('aria-expanded', 'true')
    } else {
      entry.classList.add('collapsed')
      entry.setAttribute('aria-expanded', 'false')
    }
    
    // Dispatch custom event for breadcrumb updates
    entry.dispatchEvent(new CustomEvent('json-node-toggle', {
      bubbles: true,
      detail: { expanded: !isCurrentlyCollapsed, element: entry }
    }))
  }
  
  private static buildChildrenContainer(
    value: JsonObject | JsonArray,
    type: number,
    buildDomFn: (value: JsonValue, keyName: string | false) => HTMLSpanElement
  ): HTMLSpanElement {
    const blockInner = templates.t_blockInner.cloneNode(false) as HTMLSpanElement
    blockInner.classList.add('blockInner')
    
    if (type === TYPE_OBJECT) {
      const obj = value as JsonObject
      const keys = Object.keys(obj).sort() // Sort keys for better UX
      
      keys.forEach((key, index) => {
        const childEntry = buildDomFn(obj[key], key)
        childEntry.setAttribute('data-index', index.toString())
        blockInner.appendChild(childEntry)
      })
    } else if (type === TYPE_ARRAY) {
      const arr = value as JsonArray
      
      arr.forEach((item, index) => {
        // For array items, don't show the index as a key in the UI
        const childEntry = buildDomFn(item, false)
        childEntry.setAttribute('data-index', index.toString())
        childEntry.setAttribute('data-array-index', 'true')
        blockInner.appendChild(childEntry)
      })
    }
    
    return blockInner
  }
}