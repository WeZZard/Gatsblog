// Node.js v11.10.0 Compatibility Polyfills
// This file provides necessary polyfills for modern JavaScript features
// that are not available in Node.js v11.10.0

// globalThis polyfill (introduced in Node.js v12.0.0)
// Apply polyfill more aggressively to ensure it's available everywhere
(function() {
  if (typeof globalThis === 'undefined') {
    var globalObject;
    
    if (typeof global !== 'undefined') {
      globalObject = global;
    } else if (typeof window !== 'undefined') {
      globalObject = window;
    } else if (typeof self !== 'undefined') {
      globalObject = self;
    } else {
      throw new Error('Unable to locate global object');
    }
    
    // Set globalThis on the global object
    globalObject.globalThis = globalObject;
    
    // Also set it on the global scope for immediate access
    if (typeof global !== 'undefined') {
      global.globalThis = globalObject;
    }
  }
})();

// Also set up the polyfill for eval contexts
if (typeof global !== 'undefined' && typeof global.globalThis === 'undefined') {
  global.globalThis = global;
}

console.log('Node.js v11.10.0 compatibility polyfills loaded, globalThis:', typeof globalThis);