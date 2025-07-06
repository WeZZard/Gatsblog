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
  
  if (Array.isArray(children)) {
    return children;
  } else {
    return [children];
  }
};
