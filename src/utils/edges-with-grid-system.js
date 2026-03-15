export default args => {
  const { style, top, bottom } = args;

  const topStyle = `body-${top}-top`;

  const bottomStyle = `body-${bottom}-bottom`;

  return [style, topStyle, bottomStyle].filter(_ => _).join(' ');
};
