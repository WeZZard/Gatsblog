/**
 * Normalizes given input into an array.
 * @param  {Any} children
 * @return {[Any]}
 */
export default children => {
  // Handle undefined or null children
  if (children === undefined || children === null) {
    return [];
  }
  
  // During SSR, avoid deep inspection of complex objects to prevent circular references
  if (typeof children === 'object' && children !== null) {
    // If it's already an array, return it as-is
    if (Array.isArray(children)) {
      return children;
    }
    // For any other object (including React elements), wrap in array without inspection
    return [children];
  }
  
  // Handle primitives
  return [children];
};
