export default function ExecutionProvider (execution) {
  return (context) => {
    context.execution = execution

    return context
  }
}
