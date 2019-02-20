import assert from 'assert';

const potentialEdgeStyles = ['rect', 'serif', 'sans'];

export default args => {
  const { style, top, bottom } = args;

  assert(potentialEdgeStyles.includes(top));
  assert(potentialEdgeStyles.includes(bottom));

  const topStyle = `body-${top}-top`;

  const bottomStyle = `body-${bottom}-bottom`;

  return [style, topStyle, bottomStyle].filter(_ => _).join(' ');
};
