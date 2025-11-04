export default (children, processors, rawStringProcessor) => {
  return children.map((child, index) => {
    // During SSR, avoid any property access on complex objects to prevent circular references
    if (typeof child === 'object' && child !== null && !Array.isArray(child)) {
      // For any object (including React elements), return as-is without processing
      return child;
    }
    
    // Only process primitives and strings
    if (typeof child === 'string' && rawStringProcessor) {
      return rawStringProcessor(child, index);
    }
    
    return child;
  });
};
