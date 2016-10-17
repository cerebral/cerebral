export default function InputProvider () {
  return (context, funcDetails, payload) => {
    context.input = payload || {}

    return context
  }
}
