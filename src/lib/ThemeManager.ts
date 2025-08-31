// Modern theme management with CSS custom properties
export class ThemeManager {
  private static instance: ThemeManager
  private currentTheme: string = 'system'

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager()
    }
    return ThemeManager.instance
  }

  async getTheme(): Promise<string> {
    return new Promise((resolve) => {
      chrome.storage.local.get('themeOverride', (result) => {
        this.currentTheme = result.themeOverride || 'system'
        resolve(this.currentTheme)
      })
    })
  }

  async setTheme(theme: string): Promise<void> {
    this.currentTheme = theme
    return new Promise((resolve) => {
      chrome.storage.local.set({ themeOverride: theme }, resolve)
    })
  }

  getCSS(): string {
    switch (this.currentTheme) {
      case 'force_light':
        return this.getLightThemeCSS()
      case 'force_dark':
        return this.getLightThemeCSS() + '\n\n' + this.getDarkThemeCSS()
      case 'system':
      default:
        return this.getLightThemeCSS() + '\n\n@media (prefers-color-scheme: dark) {\n' + this.getDarkThemeCSS() + '\n}'
    }
  }

  private getLightThemeCSS(): string {
    return `
/* Modern JSON Formatter Pro - 2026 Design System */

:root {
  /* Color Palette */
  --primary-50: #EEF2FF;
  --primary-100: #E0E7FF;
  --primary-200: #C7D2FE;
  --primary-300: #A5B4FC;
  --primary-400: #818CF8;
  --primary-500: #6366F1;
  --primary-600: #4F46E5;
  --primary-700: #4338CA;
  --primary-800: #3730A3;
  --primary-900: #312E81;
  
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  --success-500: #10B981;
  --warning-500: #F59E0B;
  --error-500: #EF4444;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Monaco', 'Consolas', monospace;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}

/* Base Styles */
body {
  background-color: var(--gray-50);
  color: var(--gray-900);
  font-family: var(--font-family);
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  padding: 0;
  user-select: text;
  overflow-y: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Modern Toolbar - Removed */

/* Breadcrumb System */
#breadcrumbBar {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-xl);
  padding: var(--space-3) var(--space-4);
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
  margin: var(--space-4);
  margin-top: 0;
  overflow: hidden;
  pointer-events: auto;
  flex-shrink: 0;
}

#breadcrumbBar:hover {
  box-shadow: var(--shadow-xl);
  transform: translateY(-1px);
}

.breadcrumb-container {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-family-mono);
  font-size: 13px;
  color: var(--gray-700);
  white-space: nowrap;
  overflow: hidden;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: transparent;
  border: 1px solid transparent;
}

.breadcrumb-item:hover {
  background: var(--gray-100);
  border-color: var(--gray-300);
  color: var(--gray-900);
}

.breadcrumb-item.active {
  background: var(--primary-50);
  border-color: var(--primary-200);
  color: var(--primary-700);
  font-weight: 500;
}

.breadcrumb-separator {
  color: var(--gray-400);
  font-weight: 300;
  user-select: none;
}

.breadcrumb-key {
  font-weight: 500;
  color: var(--primary-600);
}

.breadcrumb-index {
  color: var(--warning-500);
  font-weight: 500;
}

.breadcrumb-type {
  font-size: 11px;
  color: var(--gray-500);
  background: var(--gray-100);
  padding: 1px 4px;
  border-radius: var(--radius-sm);
  margin-left: var(--space-1);
}

/* Modern Buttons - Removed */

/* Main Container */
#jsonFormatterMain {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* JSON Container */
#jsonFormatterParsed {
  padding: var(--space-8) var(--space-6);
  line-height: 1.7;
  font-family: var(--font-family-mono);
  font-size: 13px;
  color: var(--gray-800);
  background: white;
  border-radius: var(--radius-lg);
  margin: var(--space-4);
  margin-bottom: var(--space-2);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

#jsonFormatterRaw {
  padding: var(--space-10) var(--space-4) var(--space-4);
  font-family: var(--font-family-mono);
  font-size: 13px;
  line-height: 1.6;
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  margin: var(--space-4);
  border: 1px solid var(--gray-200);
}

/* JSON Structure */
.entry {
  display: block;
  padding-left: var(--space-5);
  margin-left: calc(-1 * var(--space-5));
  position: relative;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.entry:hover {
  background: var(--gray-50);
  border-radius: var(--radius-sm);
}

/* Collapsible Elements */
.collapsed {
  white-space: nowrap;
}

.collapsed > .blockInner {
  display: none;
}

.collapsed > .ell::after {
  content: '…';
  font-weight: 600;
  color: var(--gray-500);
  margin: 0 var(--space-2);
}

.collapsed .entry {
  display: inline;
}

.collapsed::after {
  content: attr(data-size);
  color: var(--gray-400);
  font-size: 12px;
  font-weight: 500;
}

/* Expand/Collapse Icons */
.e {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 2px;
  color: var(--gray-500);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  background: transparent;
}

.e::after {
  content: '';
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 6px;
  border-color: transparent transparent transparent currentColor;
  transform: rotate(90deg);
  transition: transform var(--transition-fast);
}

.collapsed > .e::after {
  transform: rotate(0deg);
}

.e:hover {
  color: var(--primary-600);
  background: var(--primary-50);
}

.e:active {
  color: var(--primary-700);
  background: var(--primary-100);
}

.collapsed .entry .e {
  display: none;
}

/* Block Structure */
.blockInner {
  display: block;
  padding-left: var(--space-6);
  border-left: 2px solid var(--gray-200);
  margin-left: var(--space-1);
  transition: border-color var(--transition-fast);
}

.entry:hover > .blockInner {
  border-color: var(--primary-200);
}

/* Syntax Highlighting */
.b {
  font-weight: 600;
  color: var(--gray-900);
}

.s {
  color: var(--success-500);
  word-wrap: break-word;
  font-weight: 500;
}

.k {
  color: var(--gray-700);
  font-weight: 500;
}

.bl,
.nl,
.n {
  color: var(--primary-600);
  font-weight: 600;
}

/* Links */
a:link,
a:visited {
  text-decoration: none;
  color: var(--primary-600);
  font-weight: 500;
  transition: color var(--transition-fast);
}

a:hover,
a:active {
  text-decoration: underline;
  color: var(--primary-700);
}

/* Utility Classes */
[hidden] {
  display: none !important;
}

span {
  white-space: pre-wrap;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

#jsonFormatterParsed {
  animation: fadeIn var(--transition-slow) ease-out;
}

/* Responsive Design */
@media (max-width: 768px) {
  #breadcrumbBar {
    margin: var(--space-2);
    margin-top: 0;
  }
  
  #jsonFormatterParsed {
    margin: var(--space-2);
    padding: var(--space-4);
    margin-bottom: var(--space-1);
  }
}

/* Focus States for Accessibility */
.e:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* Loading State */
#spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`
  }

  private getDarkThemeCSS(): string {
    return `
/* Modern Dark Theme for JSON Formatter Pro */

/* Dark Theme Color Overrides */
[data-theme="dark"] {
  --gray-50: #0F172A;
  --gray-100: #1E293B;
  --gray-200: #334155;
  --gray-300: #475569;
  --gray-400: #64748B;
  --gray-500: #94A3B8;
  --gray-600: #CBD5E1;
  --gray-700: #E2E8F0;
  --gray-800: #F1F5F9;
  --gray-900: #F8FAFC;
}

/* Dark Theme Base Styles */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #0F172A;
    color: #F1F5F9;
  }

  /* Dark Toolbar */
  #optionBar {
    background: rgba(30, 41, 59, 0.95);
    border-color: #334155;
    backdrop-filter: blur(16px);
  }

  /* Dark Breadcrumb */
  #breadcrumbBar {
    background: rgba(30, 41, 59, 0.95);
    border-color: #334155;
    backdrop-filter: blur(16px);
  }

  .breadcrumb-container {
    color: #CBD5E1;
  }

  .breadcrumb-item:hover {
    background: #334155;
    border-color: #475569;
    color: #F1F5F9;
  }

  .breadcrumb-item.active {
    background: rgba(99, 102, 241, 0.2);
    border-color: #6366F1;
    color: #93C5FD;
  }

  .breadcrumb-separator {
    color: #64748B;
  }

  .breadcrumb-key {
    color: #60A5FA;
  }

  .breadcrumb-index {
    color: #F59E0B;
  }

  .breadcrumb-type {
    color: #94A3B8;
    background: #334155;
  }

  /* Dark Buttons - Removed */

  /* Dark JSON Container */
  #jsonFormatterParsed {
    background: #1E293B;
    color: #E2E8F0;
    border-color: #334155;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }

  #jsonFormatterRaw {
    background: #0F172A;
    color: #CBD5E1;
    border-color: #334155;
  }

  /* Dark JSON Structure */
  .entry:hover {
    background: rgba(99, 102, 241, 0.1);
  }

  /* Dark Block Structure */
  .blockInner {
    border-color: #475569;
  }

  .entry:hover > .blockInner {
    border-color: #6366F1;
  }

  /* Dark Syntax Highlighting */
  .b {
    color: #F8FAFC;
  }

  .s {
    color: #10B981;
  }

  .k {
    color: #CBD5E1;
  }

  .bl,
  .nl,
  .n {
    color: #60A5FA;
  }

  /* Dark Links */
  a:link,
  a:visited {
    color: #60A5FA;
  }

  a:hover,
  a:active {
    color: #93C5FD;
  }

  /* Dark Expand/Collapse Icons */
  .e {
    color: #64748B;
  }

  .e:hover {
    color: #6366F1;
    background: rgba(99, 102, 241, 0.2);
  }

  .e:active {
    color: #4F46E5;
    background: rgba(99, 102, 241, 0.3);
  }

  /* Dark Collapsed Elements */
  .collapsed > .ell::after {
    color: #64748B;
  }

  .collapsed::after {
    color: #94A3B8;
  }

  /* Dark Focus States */
  #buttonFormatted:focus,
  #buttonPlain:focus,
  .e:focus {
    outline-color: #6366F1;
  }
}

/* Force Dark Theme */
[data-theme="force_dark"] {
  --gray-50: #0F172A;
  --gray-100: #1E293B;
  --gray-200: #334155;
  --gray-300: #475569;
  --gray-400: #64748B;
  --gray-500: #94A3B8;
  --gray-600: #CBD5E1;
  --gray-700: #E2E8F0;
  --gray-800: #F1F5F9;
  --gray-900: #F8FAFC;
}

[data-theme="force_dark"] body {
  background-color: #0F172A;
  color: #F1F5F9;
}

[data-theme="force_dark"] #optionBar {
  background: rgba(30, 41, 59, 0.95);
  border-color: #334155;
  backdrop-filter: blur(16px);
}

[data-theme="force_dark"] #breadcrumbBar {
  background: rgba(30, 41, 59, 0.95);
  border-color: #334155;
  backdrop-filter: blur(16px);
}

[data-theme="force_dark"] .breadcrumb-container {
  color: #CBD5E1;
}

[data-theme="force_dark"] .breadcrumb-item:hover {
  background: #334155;
  border-color: #475569;
  color: #F1F5F9;
}

[data-theme="force_dark"] .breadcrumb-item.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366F1;
  color: #93C5FD;
}

[data-theme="force_dark"] .breadcrumb-separator {
  color: #64748B;
}

[data-theme="force_dark"] .breadcrumb-key {
  color: #60A5FA;
}

[data-theme="force_dark"] .breadcrumb-index {
  color: #F59E0B;
}

[data-theme="force_dark"] .breadcrumb-type {
  color: #94A3B8;
  background: #334155;
}

/* Force Dark Theme Buttons - Removed */

[data-theme="force_dark"] #jsonFormatterParsed {
  background: #1E293B;
  color: #E2E8F0;
  border-color: #334155;
}

[data-theme="force_dark"] #jsonFormatterRaw {
  background: #0F172A;
  color: #CBD5E1;
  border-color: #334155;
}

[data-theme="force_dark"] .entry:hover {
  background: rgba(99, 102, 241, 0.1);
}

[data-theme="force_dark"] .blockInner {
  border-color: #475569;
}

[data-theme="force_dark"] .entry:hover > .blockInner {
  border-color: #6366F1;
}

[data-theme="force_dark"] .b {
  color: #F8FAFC;
}

[data-theme="force_dark"] .s {
  color: #10B981;
}

[data-theme="force_dark"] .k {
  color: #CBD5E1;
}

[data-theme="force_dark"] .bl,
[data-theme="force_dark"] .nl,
[data-theme="force_dark"] .n {
  color: #60A5FA;
}

[data-theme="force_dark"] a:link,
[data-theme="force_dark"] a:visited {
  color: #60A5FA;
}

[data-theme="force_dark"] a:hover,
[data-theme="force_dark"] a:active {
  color: #93C5FD;
}

[data-theme="force_dark"] .e {
  color: #64748B;
}

[data-theme="force_dark"] .e:hover {
  color: #6366F1;
  background: rgba(99, 102, 241, 0.2);
}

[data-theme="force_dark"] .collapsed > .ell::after {
  color: #64748B;
}

[data-theme="force_dark"] .collapsed::after {
  color: #94A3B8;
}
`
  }
}
