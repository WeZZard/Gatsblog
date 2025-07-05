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

// ReadableStream polyfill for Node.js v16.20.2
if (typeof ReadableStream === 'undefined') {
  if (typeof global !== 'undefined') {
    // Try to get ReadableStream from stream/web
    try {
      const { ReadableStream: NodeReadableStream } = require('stream/web');
      global.ReadableStream = NodeReadableStream;
    } catch (e) {
      // Fallback - ReadableStream might not be available in this Node.js version
      console.warn('ReadableStream not available, some features may not work');
    }
  }
}

// Blob polyfill for Node.js v16.20.2
if (typeof Blob === 'undefined') {
  if (typeof global !== 'undefined') {
    try {
      const { Blob: NodeBlob } = require('buffer');
      global.Blob = NodeBlob;
    } catch (e) {
      // Fallback - Blob might not be available in this Node.js version
      console.warn('Blob not available, some features may not work');
    }
  }
}

// DOMException polyfill for Node.js v16.20.2
if (typeof DOMException === 'undefined') {
  if (typeof global !== 'undefined') {
    try {
      // Create a basic DOMException polyfill
      global.DOMException = class DOMException extends Error {
        constructor(message = '', name = 'Error') {
          super(message);
          this.name = name;
        }
      };
    } catch (e) {
      console.warn('DOMException polyfill failed, some features may not work');
    }
  }
}

console.log('Node.js compatibility polyfills loaded, globalThis:', typeof globalThis, 'ReadableStream:', typeof ReadableStream, 'Blob:', typeof Blob, 'DOMException:', typeof DOMException);