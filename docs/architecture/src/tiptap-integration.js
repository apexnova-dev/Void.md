/**
 * Tiptap Editor Integration for Markdown Task Manager 1.2.0
 * 
 * Safe integration with CDN loading, error handling, and fallback support
 * All features opt-in via feature flags
 */

// ============================================================================
// TIP TAP CONFIGURATION
// ============================================================================

const TIP_TAP_CONFIG = {
  // CDN URLs for Tiptap libraries
  cdn: {
    core: 'https://unpkg.com/@tiptap/core@2.1.13/dist/tiptap.umd.min.js',
    starterKit: 'https://unpkg.com/@tiptap/starter-kit@2.1.13/dist/tiptap.umd.min.js',
    placeholder: 'https://unpkg.com/@tiptap/extension-placeholder@2.1.13/dist/tiptap.umd.min.js',
    link: 'https://unpkg.com/@tiptap/extension-link@2.1.13/dist/tiptap.umd.min.js',
    image: 'https://unpkg.com/@tiptap/extension-image@2.1.13/dist/tiptap.umd.min.js',
    codeBlockLowlight: 'https://unpkg.com/@tiptap/extension-code-block-lowlight@2.1.13/dist/tiptap.umd.min.js',
    mention: 'https://unpkg.com/@tiptap/extension-mention@2.1.13/dist/tiptap.umd.min.js',
    typography: 'https://unpkg.com/@tiptap/extension-typography@2.1.13/dist/tiptap.umd.min.js'
  },
  
  // Configuration options
  options: {
    editor: {
      extensions: [],
      content: '',
      editable: true,
      onUpdate: null,
      onSelectionUpdate: null,
      onFocus: null,
      onBlur: null
    },
    performance: {
      targetLoadTime: 500, // ms
      maxRetries: 2
    }
  }
};

// ============================================================================
// TIP TAP LOAD MANAGER
// ============================================================================

class TiptapLoadManager {
  constructor() {
    this.loaded = false;
    this.loading = false;
    this.error = null;
    this.loadTime = null;
    this.retryCount = 0;
  }
  
  /**
   * Load Tiptap libraries from CDN
   */
  async load(config = {}) {
    if (this.loaded) {
      return { success: true, fromCache: true };
    }
    
    if (this.loading) {
      // Wait for existing load to complete
      return new Promise((resolve, reject) => {
        const checkLoaded = setInterval(() => {
          if (this.loaded) {
            clearInterval(checkLoaded);
            resolve({ success: true, fromCache: true });
          } else if (this.error) {
            clearInterval(checkLoaded);
            reject(this.error);
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkLoaded);
          reject(new Error('Tiptap load timeout'));
        }, 10000);
      });
    }
    
    this.loading = true;
    const startTime = performance.now();
    
    try {
      // Check if Tiptap is already available
      if (this.isTiptapAvailable()) {
        this.loaded = true;
        this.loadTime = performance.now() - startTime;
        this.logLoad('Already loaded');
        return { success: true, fromCache: true, loadTime: this.loadTime };
      }
      
      // Load required scripts
      await this.loadScripts(config);
      
      this.loaded = true;
      this.loadTime = performance.now() - startTime;
      this.loading = false;
      
      this.logLoad(`Loaded in ${this.loadTime.toFixed(2)}ms`);
      
      return { success: true, loadTime: this.loadTime };
      
    } catch (error) {
      this.error = error;
      this.loading = false;
      
      console.error('TiptapLoadManager: Failed to load', error);
      
      // Retry logic
      if (this.retryCount < TIP_TAP_CONFIG.options.performance.maxRetries) {
        this.retryCount++;
        console.warn(`TiptapLoadManager: Retry ${this.retryCount}/${TIP_TAP_CONFIG.options.performance.maxRetries}`);
        return this.load(config);
      }
      
      return { success: false, error: error.message, retryCount: this.retryCount };
    }
  }
  
  /**
   * Load required scripts
   */
  async loadScripts(config = {}) {
    const scripts = [];
    
    // Core is always required
    scripts.push(this.loadScript(TIP_TAP_CONFIG.cdn.core));
    
    // Load extensions based on configuration
    if (config.extensions && config.extensions.length > 0) {
      if (config.extensions.includes('starterKit')) {
        scripts.push(this.loadScript(TIP_TAP_CONFIG.cdn.starterKit));
      }
      if (config.extensions.includes('placeholder')) {
        scripts.push(this.loadScript(TIP_TAP_CONFIG.cdn.placeholder));
      }
      if (config.extensions.includes('link')) {
        scripts.push(this.loadScript(TIP_TAP_CONFIG.cdn.link));
      }
      if (config.extensions.includes('image')) {
        scripts.push(this.loadScript(TIP_TAP_CONFIG.cdn.image));
      }
      if (config.extensions.includes('codeBlock')) {
        scripts.push(this.loadScript(TIP_TAP_CONFIG.cdn.codeBlockLowlight));
      }
      if (config.extensions.includes('mention')) {
        scripts.push(this.loadScript(TIP_TAP_CONFIG.cdn.mention));
      }
      if (config.extensions.includes('typography')) {
        scripts.push(this.loadScript(TIP_TAP_CONFIG.cdn.typography));
      }
    }
    
    // Wait for all scripts to load
    await Promise.all(scripts);
  }
  
  /**
   * Load a single script
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (this.isScriptLoaded(src)) {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.defer = false;
      
      script.onload = () => {
        console.log(`TiptapLoadManager: Loaded ${src}`);
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${src}`));
      };
      
      // Performance monitoring
      script.addEventListener('load', () => {
        const loadTime = performance.now();
        if (loadTime > TIP_TAP_CONFIG.options.performance.targetLoadTime) {
          console.warn(
            `TiptapLoadManager: Slow load (${loadTime.toFixed(2)}ms) for ${src}`
          );
        }
      });
      
      document.head.appendChild(script);
    });
  }
  
  /**
   * Check if Tiptap is available globally
   */
  isTiptapAvailable() {
    return typeof window !== 'undefined' && 
           (window.Tiptap || window.tiptap || this.checkTiptapClasses());
  }
  
  /**
   * Check if Tiptap classes are available
   */
  checkTiptapClasses() {
    // Check for common Tiptap indicators
    return typeof window !== 'undefined' && (
      (window.ProseMirror !== undefined) ||
      (window.tiptap?.Core !== undefined) ||
      (window.Tiptap?.Core !== undefined)
    );
  }
  
  /**
   * Check if a specific script is already loaded
   */
  isScriptLoaded(src) {
    const scripts = document.querySelectorAll('script');
    for (const script of scripts) {
      if (script.src === src) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Log load information
   */
  logLoad(message) {
    if (typeof featureFlags !== 'undefined' && 
        featureFlags.isEnabled('ENABLE_DEBUG_MODE')) {
      console.log(`TiptapLoadManager: ${message}`);
    }
  }
  
  /**
   * Get load status
   */
  getStatus() {
    return {
      loaded: this.loaded,
      loading: this.loading,
      error: this.error,
      loadTime: this.loadTime,
      retryCount: this.retryCount
    };
  }
}

// ============================================================================
// TIP TAP EDITOR WRAPPER
// ============================================================================

class TiptapEditorWrapper {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.editor = null;
    this.initialized = false;
    this.errorBoundary = getFeatureErrorBoundary?.('ENABLE_RICH_TEXT_EDITOR') || 
                          new FeatureErrorBoundary('ENABLE_RICH_TEXT_EDITOR');
    
    // Bind methods
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    this.getHTML = this.getHTML.bind(this);
    this.getJSON = this.getJSON.bind(this);
    this.getText = this.getText.bind(this);
    this.setContent = this.setContent.bind(this);
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
  }
  
  /**
   * Initialize the editor
   */
  async init() {
    if (this.initialized) {
      console.warn('TiptapEditorWrapper: Already initialized');
      return { success: true, fromCache: true };
    }
    
    // Check if feature is enabled
    if (!isFeatureEnabled?.('ENABLE_RICH_TEXT_EDITOR')) {
      console.log('TiptapEditorWrapper: Feature not enabled, using fallback');
      return { success: false, reason: 'Feature not enabled' };
    }
    
    try {
      // Load Tiptap
      const loadManager = new TiptapLoadManager();
      const loadResult = await loadManager.load({
        extensions: ['starterKit', 'placeholder']
      });
      
      if (!loadResult.success) {
        return { success: false, reason: 'Failed to load Tiptap', error: loadResult.error };
      }
      
      // Create editor
      this.editor = this.createEditor();
      
      if (!this.editor) {
        return { success: false, reason: 'Failed to create editor' };
      }
      
      this.initialized = true;
      
      // Log initialization
      if (typeof featureFlags !== 'undefined' && 
          featureFlags.isEnabled('ENABLE_PERFORMANCE_LOGGING')) {
        console.log('TiptapEditorWrapper: Initialized', {
          loadTime: loadResult.loadTime,
          extensions: this.options.extensions?.length || 0
        });
      }
      
      return { success: true, loadTime: loadResult.loadTime };
      
    } catch (error) {
      this.errorBoundary.handleError(error);
      return { success: false, reason: 'Initialization failed', error: error.message };
    }
  }
  
  /**
   * Create the Tiptap editor instance
   */
  createEditor() {
    // Check if Tiptap is available
    if (typeof window === 'undefined' || !window.Tiptap) {
      console.error('Tiptap not available');
      return null;
    }
    
    try {
      const TiptapCore = window.Tiptap.Core || window.tiptap?.Core;
      
      if (!TiptapCore) {
        console.error('Tiptap Core not found');
        return null;
      }
      
      // Build extensions
      const extensions = [
        TiptapCore.createExtension(StarterKit)
      ];
      
      // Add placeholder if configured
      if (this.options.placeholder) {
        extensions.push(TiptapCore.createExtension(Placeholder));
      }
      
      // Create editor
      const editor = new TiptapCore({
        element: this.element,
        extensions: extensions,
        content: this.options.content || '',
        editable: this.options.editable !== false,
        onUpdate: this.options.onUpdate || null,
        onSelectionUpdate: this.options.onSelectionUpdate || null,
        onFocus: this.options.onFocus || null,
        onBlur: this.options.onBlur || null
      });
      
      return editor;
      
    } catch (error) {
      console.error('Failed to create Tiptap editor:', error);
      return null;
    }
  }
  
  /**
   * Get HTML content
   */
  getHTML() {
    if (!this.editor) {
      return this.getFallbackHTML();
    }
    
    try {
      return this.editor.getHTML();
    } catch (error) {
      this.errorBoundary.handleError(error);
      return this.getFallbackHTML();
    }
  }
  
  /**
   * Get JSON content
   */
  getJSON() {
    if (!this.editor) {
      return this.getFallbackJSON();
    }
    
    try {
      return this.editor.getJSON();
    } catch (error) {
      this.errorBoundary.handleError(error);
      return this.getFallbackJSON();
    }
  }
  
  /**
   * Get plain text content
   */
  getText() {
    if (!this.editor) {
      return this.element?.value || '';
    }
    
    try {
      return this.editor.getText();
    } catch (error) {
      this.errorBoundary.handleError(error);
      return this.element?.value || '';
    }
  }
  
  /**
   * Set content
   */
  setContent(content, emitUpdate = true) {
    if (!this.editor) {
      if (this.element) {
        this.element.value = content;
      }
      return;
    }
    
    try {
      this.editor.commands.setContent(content, emitUpdate);
    } catch (error) {
      this.errorBoundary.handleError(error);
      if (this.element) {
        this.element.value = content;
      }
    }
  }
  
  /**
   * Enable editing
   */
  enable() {
    if (this.editor) {
      try {
        this.editor.setEditable(true);
      } catch (error) {
        this.errorBoundary.handleError(error);
      }
    }
  }
  
  /**
   * Disable editing
   */
  disable() {
    if (this.editor) {
      try {
        this.editor.setEditable(false);
      } catch (error) {
        this.errorBoundary.handleError(error);
      }
    }
  }
  
  /**
   * Destroy the editor
   */
  destroy() {
    if (this.editor) {
      try {
        this.editor.destroy();
        this.editor = null;
        this.initialized = false;
      } catch (error) {
        this.errorBoundary.handleError(error);
      }
    }
  }
  
  /**
   * Fallback HTML (plain text area value)
   */
  getFallbackHTML() {
    if (this.element) {
      const text = this.element.value || '';
      // Simple HTML escaping
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
    }
    return '';
  }
  
  /**
   * Fallback JSON
   */
  getFallbackJSON() {
    const text = this.element?.value || '';
    return {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: text.split('\n').map(line => ({
          type: 'text',
          text: line
        }))
      }]
    };
  }
}

// ============================================================================
// FALLBACK EDITOR (Plain Text)
// ============================================================================

class FallbackEditor {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.listeners = [];
  }
  
  /**
   * Initialize fallback editor
   */
  init() {
    // Plain text editor needs no initialization
    console.log('FallbackEditor: Using plain text input');
    return { success: true, fromCache: false };
  }
  
  /**
   * Get content as HTML
   */
  getHTML() {
    const text = this.element?.value || '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }
  
  /**
   * Get content as JSON
   */
  getJSON() {
    const text = this.element?.value || '';
    return {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: text.split('\n').map(line => ({
          type: 'text',
          text: line
        }))
      }]
    };
  }
  
  /**
   * Get content as text
   */
  getText() {
    return this.element?.value || '';
  }
  
  /**
   * Set content
   */
  setContent(content) {
    if (this.element) {
      this.element.value = content;
    }
  }
  
  /**
   * Enable editing
   */
  enable() {
    if (this.element) {
      this.element.removeAttribute('readonly');
    }
  }
  
  /**
   * Disable editing
   */
  disable() {
    if (this.element) {
      this.element.setAttribute('readonly', 'true');
    }
  }
  
  /**
   * Destroy
   */
  destroy() {
    // No cleanup needed for fallback
  }
}

// ============================================================================
// EDITOR FACTORY
// ============================================================================

class EditorFactory {
  /**
   * Create an appropriate editor based on feature flags and availability
   */
  static create(element, options = {}) {
    // Check if rich text editor is enabled
    if (isFeatureEnabled?.('ENABLE_RICH_TEXT_EDITOR')) {
      // Try to create Tiptap editor
      const wrapper = new TiptapEditorWrapper(element, options);
      
      // Initialize and return
      wrapper.init().then(result => {
        if (!result.success) {
          console.warn('EditorFactory: Tiptap failed, using fallback');
          return new FallbackEditor(element, options);
        }
      }).catch(error => {
        console.warn('EditorFactory: Tiptap error, using fallback', error);
        return new FallbackEditor(element, options);
      });
      
      // Return wrapper immediately (async initialization)
      return wrapper;
    }
    
    // Use fallback for disabled or unavailable
    return new FallbackEditor(element, options);
  }
  
  /**
   * Create editor synchronously (for known fallback cases)
   */
  static createSync(element, options = {}) {
    if (isFeatureEnabled?.('ENABLE_RICH_TEXT_EDITOR')) {
      // Check if Tiptap is available
      const loadManager = new TiptapLoadManager();
      if (loadManager.isTiptapAvailable()) {
        return new TiptapEditorWrapper(element, options);
      }
    }
    
    // Use fallback
    return new FallbackEditor(element, options);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TIP_TAP_CONFIG,
    TiptapLoadManager,
    TiptapEditorWrapper,
    FallbackEditor,
    EditorFactory
  };
}
