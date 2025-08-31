// Value rendering utilities for different JSON types
import { TYPE_ARRAY, TYPE_BOOL, TYPE_NULL, TYPE_NUMBER, TYPE_OBJECT, TYPE_STRING } from '../constants'
import { templates } from '../templates'
import { JsonValue } from '../types'

export class ValueRenderer {
  static renderPrimitive(value: JsonValue, type: number): HTMLSpanElement {
    const primitiveSpan = templates.t_primitive.cloneNode(false) as HTMLSpanElement
    let stringValue = ''
    
    switch (type) {
      case TYPE_STRING:
        primitiveSpan.classList.add('s')
        // Don't add quotes here - CSS handles them via ::before and ::after
        if (typeof value === 'string') {
          stringValue = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
        } else {
          stringValue = String(value)
        }
        
        // Enhanced 2026 features - detect special string types
        if (typeof value === 'string') {
          if (this.isURL(value)) {
            primitiveSpan.setAttribute('data-type', 'url')
            const linkElement = this.createLinkElement(value)
            primitiveSpan.appendChild(linkElement)
            return primitiveSpan
          } else if (this.isEmail(value)) {
            primitiveSpan.setAttribute('data-type', 'email')
          } else if (this.isDateString(value)) {
            primitiveSpan.setAttribute('data-type', 'date')
          }
        }
        break
        
      case TYPE_NUMBER:
        primitiveSpan.classList.add('n')
        stringValue = JSON.stringify(value)
        
        // Enhanced 2026 features - detect large numbers
        if (typeof value === 'number' && Math.abs(value) >= 1000000) {
          primitiveSpan.setAttribute('data-type', 'large')
        }
        break
        
      case TYPE_BOOL:
        primitiveSpan.classList.add('bl')
        primitiveSpan.setAttribute('data-value', String(value))
        stringValue = JSON.stringify(value)
        break
        
      case TYPE_NULL:
        primitiveSpan.classList.add('nl')
        stringValue = 'null'
        break
    }
    
    primitiveSpan.textContent = stringValue
    return primitiveSpan
  }
  
  static renderKey(keyName: string): HTMLSpanElement {
    const keySpan = templates.t_key.cloneNode(false) as HTMLSpanElement
    keySpan.classList.add('k')
    // Add quotes for keys (CSS only adds colon via ::after)
    keySpan.textContent = `"${keyName.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
    return keySpan
  }
  
  static renderCollectionBrackets(type: number, isOpening: boolean): HTMLSpanElement {
    const bracketSpan = templates.t_bracket.cloneNode(false) as HTMLSpanElement
    bracketSpan.classList.add('b')
    
    if (type === TYPE_OBJECT) {
      bracketSpan.textContent = isOpening ? '{' : '}'
    } else if (type === TYPE_ARRAY) {
      bracketSpan.textContent = isOpening ? '[' : ']'
    }
    
    return bracketSpan
  }
  
  static createSizeIndicator(size: number): HTMLSpanElement {
    const sizeSpan = document.createElement('span')
    sizeSpan.className = 'size-indicator'
    sizeSpan.textContent = `${size} ${size === 1 ? 'item' : 'items'}`
    return sizeSpan
  }
  
  // Enhanced 2026 utility methods
  private static isURL(str: string): boolean {
    try {
      new URL(str)
      return str.startsWith('http://') || str.startsWith('https://')
    } catch {
      return false
    }
  }
  
  private static isEmail(str: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(str)
  }
  
  private static isDateString(str: string): boolean {
    const date = new Date(str)
    return !isNaN(date.getTime()) && str.includes('-')
  }
  
  private static createLinkElement(url: string): HTMLAnchorElement {
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.textContent = url.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
    return link
  }
}