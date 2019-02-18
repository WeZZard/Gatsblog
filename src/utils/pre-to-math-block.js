export default (args) => {
    if (
        // children is MDXTag
        args.children &&
        // MDXTag props
        args.children.props &&
        // if MDXTag is going to render a <MathBlock>
        args.children.props.name === "MathBlock"
    ) {
        return args.children.props;
    }
};
