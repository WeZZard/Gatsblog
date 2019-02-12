export default (args) => {
    if (
        args.children &&
        args.children.type &&
        args.children.type === 'picture'
    )
    {
        return {
            children: args.children.children,
            ...args.children.props
        }
    }
}
