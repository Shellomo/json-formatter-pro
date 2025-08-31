# JSON Formatter Pro 🚀

> **Modern, beautiful, and feature-rich JSON viewing experience for 2026**

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Install-blue?logo=google-chrome)](https://chromewebstore.google.com/detail/json-formatter-pro)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/json-formatter-pro)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

JSON Formatter Pro transforms raw JSON into beautifully formatted, interactive documents with syntax highlighting, collapsible trees, and a modern design system built for the future.

## ✨ Features

### 🎨 **Modern Design**
- **2026-ready UI** with sleek, minimalist design
- **CSS Custom Properties** for consistent theming
- **Smooth animations** and micro-interactions
- **Responsive design** that works on all screen sizes
- **Accessibility-first** approach with proper focus states

### 🌙 **Advanced Theming**
- **System theme detection** (follows OS dark/light mode)
- **Manual theme override** (force light or dark)
- **Beautiful dark mode** with carefully crafted color palette
- **Smooth theme transitions**

### ⚡ **Performance Optimized**
- **Lightning fast** parsing and rendering
- **Efficient DOM manipulation** with modern JavaScript
- **Optimized for large JSON files** (up to 3MB)
- **Minimal impact** on page performance

### 🔧 **Enhanced Functionality**
- **Collapsible tree structure** with visual guides
- **Keyboard shortcuts** (Ctrl/Cmd + click for bulk operations)
- **Clickable URLs** with proper styling
- **Copy functionality** for values and paths
- **Search and filter** capabilities (coming soon)

### 🛠 **Developer Experience**
- **TypeScript** for type safety and better development
- **Modern build system** with Vite
- **ES6+ features** throughout the codebase
- **Comprehensive error handling**
- **Extensive customization options**

## 🚀 Quick Start

### Installation

1. **Chrome Web Store** (Recommended)
   - Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/json-formatter-pro)
   - Click "Add to Chrome"
   - Start formatting JSON instantly!

2. **Manual Installation**
   ```bash
   # Clone the repository
   git clone https://github.com/json-formatter-pro/json-formatter-pro.git
   cd json-formatter-pro
   
   # Install dependencies
   npm install
   
   # Build the extension
   npm run build
   
   # Load in Chrome
   # 1. Open Chrome and go to chrome://extensions/
   # 2. Enable "Developer mode"
   # 3. Click "Load unpacked" and select the `dist` folder
   ```

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## 🎯 Usage

### Basic Usage
1. Navigate to any page with JSON content
2. The extension automatically detects and formats JSON
3. Use the toggle buttons to switch between "Raw" and "Parsed" views
4. Click the expand/collapse arrows to navigate the JSON structure

### Advanced Features
- **Bulk Operations**: Hold `Ctrl` (Windows) or `Cmd` (Mac) while clicking expand/collapse to affect all siblings
- **Theme Switching**: Right-click the extension icon to access theme options
- **Settings**: Click the extension icon and select "Options" for advanced configuration

### Keyboard Shortcuts
- `Ctrl/Cmd + Click`: Expand/collapse all siblings
- `Tab`: Navigate through JSON structure
- `Enter`: Expand/collapse current node
- `Escape`: Collapse all nodes

## 🎨 Customization

### Theme Options
- **System**: Automatically follows your OS theme
- **Light**: Always use light theme
- **Dark**: Always use dark theme

### Advanced Settings
- **Performance Mode**: Optimize for very large JSON files
- **Auto-expand Arrays**: Automatically expand small arrays
- **Show Line Numbers**: Display line numbers in raw view
- **Custom Colors**: Import/export custom color schemes

## 🏗 Architecture

### Modern Tech Stack
- **TypeScript** for type safety
- **Vite** for fast builds
- **CSS Custom Properties** for theming
- **ES6+ Modules** for clean code organization
- **Chrome Extension Manifest V3** for modern APIs

### Project Structure
```
src/
├── content.entry.ts      # Main content script
├── manifest.json         # Extension manifest
├── style.css            # Light theme styles
├── styleDark.css        # Dark theme styles
├── icons/               # Modern SVG icons
├── lib/                 # Core utilities
└── options/             # Settings page
```

### Key Components
- **ThemeManager**: Handles theme switching and persistence
- **JSONFormatterPro**: Main formatter class with modern architecture
- **OptionsManager**: Settings page with enhanced functionality
- **buildDom**: Efficient DOM building for JSON structures

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Guidelines
- Follow the existing code style
- Add TypeScript types for new features
- Include tests for new functionality
- Update documentation as needed
- Ensure accessibility standards are met

## 📝 Changelog

### [1.0.0] - 2026-01-01
#### Added
- Complete redesign with modern UI/UX
- Advanced theming system with CSS custom properties
- TypeScript migration for better development experience
- Enhanced options page with import/export functionality
- Modern SVG icons with multiple sizes
- Performance optimizations for large JSON files
- Improved accessibility and keyboard navigation
- Responsive design for all screen sizes

#### Changed
- Updated to Chrome Extension Manifest V3
- Modernized build system with Vite
- Improved error handling and user feedback
- Enhanced dark mode with better color contrast
- Streamlined code architecture with classes

#### Removed
- Legacy Deno build system
- Old PNG icons
- Outdated CSS frameworks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original JSON Formatter by Callum Locke
- Modern design inspiration from contemporary web applications
- Chrome Extension community for best practices
- Contributors and users who provide feedback

## 🔗 Links

- **[Chrome Web Store](https://chromewebstore.google.com/detail/json-formatter-pro)** - Download the extension
- **[GitHub Repository](https://github.com/json-formatter-pro)** - Source code
- **[Issues](https://github.com/json-formatter-pro/issues)** - Report bugs or request features
- **[Discussions](https://github.com/json-formatter-pro/discussions)** - Community discussions

---

**Made with ❤️ for developers worldwide**

*JSON Formatter Pro - Making JSON beautiful since 2026*
