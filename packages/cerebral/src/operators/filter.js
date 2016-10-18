export default function (template, filterFunc) {
  const filterValue = typeof filterFunc === 'function'
    ? filterFunc
    : (value) => value === filterFunc

  function filter (context) {
    const value = template(context).toValue()

    return filterValue(value) ? context.path.accepted() : context.path.discarded()
  }

  filter.displayName = 'operator.filter'

  return filter
}
