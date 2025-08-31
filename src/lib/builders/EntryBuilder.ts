// Main entry point for building JSON DOM entries
import { TYPE_ARRAY, TYPE_OBJECT } from '../constants'
import { getValueType } from '../getValueType'
import { JsonValue } from '../types'
import { CollectionBuilder } from './CollectionBuilder'
import { ValueRenderer } from './ValueRenderer'

export class EntryBuilder {
  /**
   * Builds a DOM entry for any JSON value
   * @param value The JSON value to render
   * @param keyName The key name if this is an object property, or false if it's a root value
   * @param depth The nesting depth for enhanced styling (2026 feature)
   * @returns The built DOM element
   */
  static buildEntry(
    value: JsonValue,
    keyName: string | false = false,
    depth: number = 0
  ): HTMLSpanElement {
    const type = getValueType(value)
    
    // Handle collections (objects and arrays)
    if (type === TYPE_OBJECT || type === TYPE_ARRAY) {
      const { entry } = CollectionBuilder.buildCollection(
        value as any,
        type,
        keyName,
        (childValue, childKey) => this.buildEntry(childValue, childKey, depth + 1)
      )
      
      // Add depth data for enhanced styling
      entry.setAttribute('data-depth', depth.toString())
      entry.classList.add('entry')
      
      return entry
    }
    
    // Handle primitive values
    return this.buildPrimitiveEntry(value, keyName, type, depth)
  }
  
  private static buildPrimitiveEntry(
    value: JsonValue,
    keyName: string | false,
    type: number,
    depth: number
  ): HTMLSpanElement {
    const entry = document.createElement('span')
    entry.classList.add('entry', 'primitive')
    entry.setAttribute('data-type', 'primitive')
    entry.setAttribute('data-depth', depth.toString())
    
    // Add key if this is an object property
    if (keyName !== false) {
      const keySpan = ValueRenderer.renderKey(keyName)
      entry.appendChild(keySpan)
    }
    
    // Add the primitive value
    const valueSpan = ValueRenderer.renderPrimitive(value, type)
    entry.appendChild(valueSpan)
    
    return entry
  }
  
  /**
   * Enhanced 2026 feature: Build entry with performance optimization
   */
  static buildEntryOptimized(
    value: JsonValue,
    keyName: string | false = false,
    options: {
      depth?: number
      lazy?: boolean
      maxDepth?: number
    } = {}
  ): HTMLSpanElement {
    const { depth = 0, lazy = false, maxDepth = 10 } = options
    
    // Lazy loading for deeply nested structures
    if (lazy && depth > maxDepth) {
      return this.createLazyPlaceholder(value, keyName, depth)
    }
    
    return this.buildEntry(value, keyName, depth)
  }
  
  private static createLazyPlaceholder(
    value: JsonValue,
    keyName: string | false,
    depth: number
  ): HTMLSpanElement {
    const placeholder = document.createElement('span')
    placeholder.classList.add('entry', 'lazy-placeholder')
    placeholder.setAttribute('data-depth', depth.toString())
    
    if (keyName !== false) {
      const keySpan = ValueRenderer.renderKey(keyName)
      placeholder.appendChild(keySpan)
    }
    
    const loadButton = document.createElement('button')
    loadButton.textContent = 'Load more...'
    loadButton.className = 'load-more-btn'
    
    loadButton.addEventListener('click', () => {
      const actualEntry = this.buildEntry(value, keyName, depth)
      placeholder.replaceWith(actualEntry)
    })
    
    placeholder.appendChild(loadButton)
    return placeholder
  }
}