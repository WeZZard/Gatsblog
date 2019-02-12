export default (args) => {
    if (
        // children is MDXTag
        args.children &&
        // MDXTag props
        args.children.props &&
        // if MDXTag is going to render a <code>
        args.children.props.name === "Math"
    ) {
        // we have a <pre><Math> situation
        return args.children.props;
    }
};
