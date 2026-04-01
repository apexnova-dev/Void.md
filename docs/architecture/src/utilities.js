/**
 * Utility Functions for Void.md 1.2.0
 * 
 * Error handling, performance monitoring, and helper functions
 */

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Wrap a function with error handling
 */
function safeCall(fn, fallback = null, context = 'Unknown') {
  return function(...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      console.error(`safeCall [${context}]:`, error.message);
      if (typeof featureFlags !== 'undefined' && 
          featureFlags.isEnabled('ENABLE_DEBUG_MODE')) {
        console.error('Full error:', error);
      }
      return fallback;
    }
  };
}

/**
 * Wrap an async function with error handling
 */
async function safeAsyncCall(fn, fallback = null, context = 'Unknown') {
  try {
    return await fn();
  } catch (error) {
    console.error(`safeAsyncCall [${context}]:`, error.message);
    if (typeof featureFlags !== 'undefined' && 
        featureFlags.isEnabled('ENABLE_DEBUG_MODE')) {
      console.error('Full error:', error);
    }
    return fallback;
  }
}

/**
 * Create a try-catch wrapper for promises
 */
function tryPromise(promise, errorValue = null, context = 'Unknown') {
  return promise
    .then(result => ({ success: true, result }))
    .catch(error => {
      console.error(`tryPromise [${context}]:`, error.message);
      if (typeof featureFlags !== 'undefined' && 
          featureFlags.isEnabled('ENABLE_DEBUG_MODE')) {
        console.error('Full error:', error);
      }
      return { success: false, error: error.message, result: errorValue };
    });
}

/**
 * Create error with context
 */
function createError(message, context = {}, originalError = null) {
  const error = new Error(message);
  error.context = context;
  error.originalError = originalError;
  error.timestamp = new Date().toISOString();
  return error;
}

// ============================================================================
// PERFORMANCE UTILITIES
// ============================================================================

/**
 * Simple performance tracker
 */
class PerformanceTracker {
  constructor(featureName) {
    this.featureName = featureName;
    this.metrics = [];
    this.startTime = null;
  }
  
  /**
   * Start tracking
   */
  start() {
    this.startTime = performance.now();
    return this;
  }
  
  /**
   * Stop tracking and record
   */
  stop(label = 'Operation') {
    if (!this.startTime) {
      console.warn('PerformanceTracker: Not started');
      return null;
    }
    
    const duration = performance.now() - this.startTime;
    
    const metric = {
      label,
      duration,
      timestamp: new Date().toISOString()
    };
    
    this.metrics.push(metric);
    
    // Log if slow
    if (duration > 100) {
      console.warn(`PerformanceTracker [${this.featureName}]: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    // Performance logging if enabled
    if (typeof featureFlags !== 'undefined' && 
        featureFlags.isEnabled('ENABLE_PERFORMANCE_LOGGING')) {
      console.log(`PerformanceTracker [${this.featureName}]:`, metric);
    }
    
    this.startTime = null;
    return duration;
  }
  
  /**
   * Record a metric directly
   */
  record(label, duration) {
    this.metrics.push({
      label,
      duration,
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Get all metrics
   */
  getMetrics() {
    return [...this.metrics];
  }
  
  /**
   * Get average duration
   */
  getAverage(label = null) {
    const relevant = label 
      ? this.metrics.filter(m => m.label === label)
      : this.metrics;
    
    if (relevant.length === 0) return 0;
    
    const total = relevant.reduce((sum, m) => sum + m.duration, 0);
    return total / relevant.length;
  }
  
  /**
   * Get slowest operation
   */
  getSlowest() {
    if (this.metrics.length === 0) return null;
    
    return this.metrics.reduce((slowest, current) => 
      current.duration > slowest.duration ? current : slowest
    );
  }
  
  /**
   * Clear metrics
   */
  clear() {
    this.metrics = [];
  }
}

/**
 * Debounce function
 */
function debounce(fn, delay = 300) {
  let timeoutId = null;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * Throttle function
 */
function throttle(fn, limit = 300) {
  let inThrottle = false;
  
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Measure execution time of a function
 */
function measureTime(fn, label = 'Function') {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  console.log(`${label} took ${duration.toFixed(2)}ms`);
  return result;
}

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

/**
 * Check if storage is available
 */
function isStorageAvailable(type = 'localStorage') {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Safe localStorage operations
 */
const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error('Storage.get error:', error);
      return defaultValue;
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage.set error:', error);
      return false;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Storage.remove error:', error);
      return false;
    }
  },
  
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Storage.clear error:', error);
      return false;
    }
  }
};

/**
 * Generate unique ID
 */
function generateId(prefix = 'id') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Deep clone an object
 */
function deepClone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('deepClone error:', error);
    return obj;
  }
}

/**
 * Merge objects deeply
 */
function deepMerge(target, source) {
  const result = deepClone(target);
  
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
}

// ============================================================================
// DOM UTILITIES
// ============================================================================

/**
 * Create element with classes and attributes
 */
function createElement(tag, className = '', attributes = {}) {
  const element = document.createElement(tag);
  
  if (className) {
    element.className = className;
  }
  
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'dataset') {
      for (const [dataKey, dataValue] of Object.entries(value)) {
        element.dataset[dataKey] = dataValue;
      }
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(key, value);
    }
  }
  
  return element;
}

/**
 * Find closest element matching selector
 */
function closest(element, selector) {
  if (!element || !selector) return null;
  
  if (element.closest) {
    return element.closest(selector);
  }
  
  // Fallback for older browsers
  let current = element;
  while (current && current !== document.body) {
    if (current.matches && current.matches(selector)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

/**
 * Debounced DOM update
 */
function debouncedUpdate(fn, delay = 100) {
  let timeoutId = null;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// ============================================================================
// DATE UTILITIES
// ============================================================================

/**
 * Format date for display
 */
function formatDate(date, format = 'short') {
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    return 'Invalid date';
  }
  
  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    relative: null
  };
  
  if (format === 'relative') {
    return formatRelativeTime(date);
  }
  
  return d.toLocaleDateString('en-US', options[format] || options.short);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
function formatRelativeTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date, 'short');
  }
}

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Escape HTML special characters
 */
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Truncate string with ellipsis
 */
function truncate(str, maxLength = 100, suffix = '...') {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Error handling
    safeCall,
    safeAsyncCall,
    tryPromise,
    createError,
    
    // Performance
    PerformanceTracker,
    debounce,
    throttle,
    measureTime,
    
    // Storage
    isStorageAvailable,
    Storage,
    
    // General
    generateId,
    deepClone,
    deepMerge,
    
    // DOM
    createElement,
    closest,
    debouncedUpdate,
    
    // Date
    formatDate,
    formatRelativeTime,
    
    // String
    escapeHTML,
    truncate,
    capitalize
  };
}
