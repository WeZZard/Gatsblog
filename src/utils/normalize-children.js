export default children => {
  if (Array.isArray(children)) {
    return children;
  } else {
    return [children];
  }
};
