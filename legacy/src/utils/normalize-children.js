/**
 * Normalizes given input into an array.
 * @param  {Any} children
 * @return {[Any]}
 */
export default children => {
  if (Array.isArray(children)) {
    return children;
  } else {
    return [children];
  }
};
