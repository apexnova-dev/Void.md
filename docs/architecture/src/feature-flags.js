/**
 * Feature Flag System for Markdown Task Manager 1.2.0
 * 
 * Conservative implementation approach - all features OFF by default (opt-in only)
 * No breaking changes to existing functionality
 */

// ============================================================================
// FEATURE FLAG CONFIGURATION
// ============================================================================

const FEATURE_FLAGS = {
  // Core features - all disabled by default for safety
  ENABLE_RICH_TEXT_EDITOR: {
    enabled: false,
    description: 'Enable Tiptap rich text editor with formatting toolbar',
    version: '1.2.0',
    dependencies: ['ENABLE_SLASH_COMMANDS'],
    fallback: 'plain-text'
  },
  
  ENABLE_COMMENTS: {
    enabled: false,
    description: 'Enable threaded comments on tasks',
    version: '1.2.0',
    dependencies: [],
    fallback: null
  },
  
  ENABLE_SLASH_COMMANDS: {
    enabled: false,
    description: 'Enable "/" command palette for quick formatting',
    version: '1.2.0',
    dependencies: ['ENABLE_RICH_TEXT_EDITOR'],
    fallback: null
  },
  
  // Development/Testing flags
  ENABLE_DEBUG_MODE: {
    enabled: false,
    description: 'Enable debug logging and console output',
    version: '1.2.0',
    dependencies: [],
    fallback: null
  },
  
  ENABLE_PERFORMANCE_LOGGING: {
    enabled: false,
    description: 'Log performance metrics for new features',
    version: '1.2.0',
    dependencies: [],
    fallback: null
  }
};

// ============================================================================
// FEATURE FLAG MANAGER
// ============================================================================

class FeatureFlagManager {
  constructor() {
    this.flags = FEATURE_FLAGS;
    this.initialized = false;
    this.listeners = new Map();
  }
  
  /**
   * Initialize feature flags from settings
   * Must be called before any feature flag checks
   */
  init(savedSettings = {}) {
    if (this.initialized) {
      console.warn('FeatureFlagManager: Already initialized');
      return this;
    }
    
    // Apply saved settings
    for (const [key, value] of Object.entries(savedSettings)) {
      if (this.flags[key] && typeof value === 'boolean') {
        this.flags[key].enabled = value;
      }
    }
    
    this.initialized = true;
    this.logStatus();
    return this;
  }
  
  /**
   * Check if a specific feature is enabled
   */
  isEnabled(featureName) {
    if (!this.initialized) {
      console.warn(`FeatureFlagManager: Not initialized. Call init() first.`);
      return false;
    }
    
    if (!this.flags[featureName]) {
      console.warn(`FeatureFlagManager: Unknown feature "${featureName}"`);
      return false;
    }
    
    return this.flags[featureName].enabled === true;
  }
  
  /**
   * Check if all dependencies of a feature are enabled
   */
  checkDependencies(featureName) {
    const feature = this.flags[featureName];
    if (!feature || !feature.dependencies || feature.dependencies.length === 0) {
      return { valid: true, missing: [] };
    }
    
    const missing = feature.dependencies.filter(dep => !this.isEnabled(dep));
    return {
      valid: missing.length === 0,
      missing: missing
    };
  }
  
  /**
   * Enable a feature (with dependency checking)
   */
  enable(featureName, force = false) {
    if (!this.flags[featureName]) {
      return { success: false, error: 'Unknown feature' };
    }
    
    // Check dependencies unless forcing
    if (!force) {
      const deps = this.checkDependencies(featureName);
      if (!deps.valid) {
        return { 
          success: false, 
          error: `Missing dependencies: ${deps.missing.join(', ')}`,
          missing: deps.missing
        };
      }
    }
    
    this.flags[featureName].enabled = true;
    this.notifyListeners(featureName, true);
    
    return { success: true, feature: featureName };
  }
  
  /**
   * Disable a feature
   */
  disable(featureName) {
    if (!this.flags[featureName]) {
      return { success: false, error: 'Unknown feature' };
    }
    
    this.flags[featureName].enabled = false;
    this.notifyListeners(featureName, false);
    
    return { success: true, feature: featureName };
  }
  
  /**
   * Get feature information
   */
  getInfo(featureName) {
    return this.flags[featureName] || null;
  }
  
  /**
   * Get all enabled features
   */
  getEnabledFeatures() {
    return Object.entries(this.flags)
      .filter(([_, config]) => config.enabled)
      .map(([name, _]) => name);
  }
  
  /**
   * Get all disabled features
   */
  getDisabledFeatures() {
    return Object.entries(this.flags)
      .filter(([_, config]) => !config.enabled)
      .map(([name, _]) => name);
  }
  
  /**
   * Subscribe to feature flag changes
   */
  addListener(featureName, callback) {
    if (!this.listeners.has(featureName)) {
      this.listeners.set(featureName, []);
    }
    this.listeners.get(featureName).push(callback);
  }
  
  /**
   * Unsubscribe from feature flag changes
   */
  removeListener(featureName, callback) {
    if (this.listeners.has(featureName)) {
      const callbacks = this.listeners.get(featureName);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  /**
   * Notify all listeners of a feature change
   */
  notifyListeners(featureName, enabled) {
    if (this.listeners.has(featureName)) {
      this.listeners.get(featureName).forEach(callback => {
        try {
          callback(featureName, enabled);
        } catch (error) {
          console.error(`FeatureFlagManager: Listener error for "${featureName}"`, error);
        }
      });
    }
  }
  
  /**
   * Export current settings for persistence
   */
  exportSettings() {
    const settings = {};
    for (const [key, config] of Object.entries(this.flags)) {
      settings[key] = config.enabled;
    }
    return settings;
  }
  
  /**
   * Log current status (debug mode only)
   */
  logStatus() {
    if (!this.isEnabled('ENABLE_DEBUG_MODE')) {
      return;
    }
    
    console.group('FeatureFlagManager: Status');
    console.log('Initialized:', this.initialized);
    console.log('Enabled features:', this.getEnabledFeatures());
    console.log('Disabled features:', this.getDisabledFeatures());
    console.table(this.flags);
    console.groupEnd();
  }
  
  /**
   * Reset all flags to default (disabled)
   */
  reset() {
    for (const key of Object.keys(this.flags)) {
      this.flags[key].enabled = false;
    }
    this.initialized = false;
    return this;
  }
}

// ============================================================================
// FALLBACK STRATEGY
// ============================================================================

class FallbackManager {
  constructor(featureFlags) {
    this.featureFlags = featureFlags;
    this.fallbacks = new Map();
    this.registerDefaultFallbacks();
  }
  
  /**
   * Register default fallback strategies
   */
  registerDefaultFallbacks() {
    // Rich text editor fallback
    this.fallbacks.set('ENABLE_RICH_TEXT_EDITOR', {
      strategy: 'plain-text',
      levels: [
        { name: 'tiptap-editor', check: () => this.checkTiptapAvailability() },
        { name: 'plain-text', check: () => true }
      ]
    });
    
    // Slash commands fallback
    this.fallbacks.set('ENABLE_SLASH_COMMANDS', {
      strategy: 'toolbar-only',
      levels: [
        { name: 'full-commands', check: () => this.checkTiptapAvailability() },
        { name: 'toolbar-only', check: () => true }
      ]
    });
    
    // Comments fallback
    this.fallbacks.set('ENABLE_COMMENTS', {
      strategy: 'hidden',
      levels: [
        { name: 'enabled', check: () => this.checkStorageAvailability() },
        { name: 'hidden', check: () => true }
      ]
    });
  }
  
  /**
   * Check if Tiptap library is available
   */
  checkTiptapAvailability() {
    try {
      return typeof window !== 'undefined' && 
             typeof document !== 'undefined' &&
             // Check if Tiptap scripts loaded
             this.detectTiptapScripts();
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Detect if Tiptap scripts are loaded
   */
  detectTiptapScripts() {
    // Check for Tiptap in global scope
    if (typeof window !== 'undefined') {
      // Check for common Tiptap indicators
      const scripts = document.querySelectorAll('script');
      for (const script of scripts) {
        if (script.src && script.src.includes('tiptap')) {
          return true;
        }
      }
      
      // Check if Tiptap is loaded
      if (window.Tiptap || window.tiptap) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Check if storage is available
   */
  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Get fallback for a feature
   */
  getFallback(featureName) {
    const feature = this.featureFlags.getInfo(featureName);
    if (!feature) {
      return null;
    }
    
    // If feature is disabled, no fallback needed
    if (!feature.enabled) {
      return { active: 'none', feature: featureName };
    }
    
    // Get fallback strategy
    const strategy = this.fallbacks.get(featureName);
    if (!strategy) {
      return { active: 'none', feature: featureName };
    }
    
    // Find the first available fallback level
    for (const level of strategy.levels) {
      if (level.check()) {
        return { 
          active: level.name, 
          feature: featureName,
          strategy: strategy.strategy
        };
      }
    }
    
    // Last resort fallback
    return { active: 'disabled', feature: featureName };
  }
  
  /**
   * Get the appropriate renderer based on fallback
   */
  getRenderer(featureName) {
    const fallback = this.getFallback(featureName);
    
    switch (fallback.active) {
      case 'tiptap-editor':
        return 'TiptapEditor';
      case 'plain-text':
        return 'PlainTextEditor';
      case 'full-commands':
        return 'SlashCommandPalette';
      case 'toolbar-only':
        return 'ToolbarOnly';
      case 'enabled':
        return 'CommentThread';
      case 'hidden':
        return 'NoComments';
      case 'disabled':
        return 'Disabled';
      default:
        return 'Default';
    }
  }
}

// ============================================================================
// ERROR BOUNDARY
// ============================================================================

class FeatureErrorBoundary {
  constructor(featureName) {
    this.featureName = featureName;
    this.errorCount = 0;
    this.maxErrors = 3;
  }
  
  /**
   * Wrap a function with error handling
   */
  wrap(fn, fallbackValue = null) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handleError(error);
        return fallbackValue;
      }
    };
  }
  
  /**
   * Wrap an async function with error handling
   */
  wrapAsync(fn, fallbackPromise) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handleError(error);
        return await fallbackPromise();
      }
    };
  }
  
  /**
   * Handle an error
   */
  handleError(error) {
    this.errorCount++;
    
    if (this.errorCount <= this.maxErrors) {
      console.warn(
        `FeatureErrorBoundary [${this.featureName}]: Error ${this.errorCount}/${this.maxErrors}`,
        error.message
      );
      
      // Log full error in debug mode
      if (typeof featureFlags !== 'undefined' && 
          featureFlags.isEnabled('ENABLE_DEBUG_MODE')) {
        console.error(`Full error for ${this.featureName}:`, error);
      }
    }
    
    // Disable feature after too many errors
    if (this.errorCount > this.maxErrors) {
      console.error(
        `FeatureErrorBoundary [${this.featureName}]: Too many errors, disabling feature`
      );
      
      if (typeof featureFlags !== 'undefined') {
        featureFlags.disable(this.featureName);
      }
    }
  }
  
  /**
   * Reset error count
   */
  reset() {
    this.errorCount = 0;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Create global instances
let featureFlagManager;
let fallbackManager;

function initFeatureSystem(savedSettings = {}) {
  featureFlagManager = new FeatureFlagManager();
  featureFlagManager.init(savedSettings);
  
  fallbackManager = new FallbackManager(featureFlagManager);
  
  return { featureFlagManager, fallbackManager };
}

function getFeatureFlags() {
  return featureFlagManager;
}

function getFallbackManager() {
  return fallbackManager;
}

function isFeatureEnabled(featureName) {
  return featureFlagManager?.isEnabled(featureName) ?? false;
}

function getFeatureErrorBoundary(featureName) {
  return new FeatureErrorBoundary(featureName);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FEATURE_FLAGS,
    FeatureFlagManager,
    FallbackManager,
    FeatureErrorBoundary,
    initFeatureSystem,
    getFeatureFlags,
    getFallbackManager,
    isFeatureEnabled,
    getFeatureErrorBoundary
  };
}
