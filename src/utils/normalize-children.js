/**
 * Normalizes given input into an array.
 * @param  {Any} children
 * @return {[Any]}
 */
export default children => {
  // Handle falsy values first
  if (!children) {
    return [];
  }
  
  // For arrays, return as-is
  if (Array.isArray(children)) {
    return children;
  }
  
  // For everything else, wrap in array without any property access
  // This avoids triggering circular reference issues during SSR
  return [children];
};
