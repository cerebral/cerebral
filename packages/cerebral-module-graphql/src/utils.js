export function isFieldsOfObjectType (node, parent, queryTypes) {
  return (
    node.kind === 'SelectionSet' &&
    parent.kind === 'Field' &&
    queryTypes[parent.name.value]
  )
}

export function getMissingIdFieldName (node, objectType) {
  const idFieldName = Object.keys(objectType.fields).reduce((idField, fieldName) => {
    if (objectType.fields[fieldName].name === 'ID') {
      return fieldName
    }

    return idField
  }, null)

  return node.selections.filter((selection) => {
    return selection.name.value === idFieldName
  }).length === 0 && idFieldName
}

export function getMissingArgFieldNames (node, objectType) {
  const existingFieldNames = node.selectionSet.selections.map((selection) => {
    return selection.name.value
  })
  return node.arguments.reduce((missingArgFieldNames, arg) => {
    return missingArgFieldNames.concat(
      existingFieldNames.indexOf(arg.name.value) === -1 ? arg.name.value : []
    )
  }, [])
}
