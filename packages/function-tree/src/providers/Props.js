export default function PropsProvider () {
  return (context, funcDetails, payload) => {
    context.props = payload || {}

    return context
  }
}
