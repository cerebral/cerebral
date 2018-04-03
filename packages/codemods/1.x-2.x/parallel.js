'use strict'
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)
  let addImport = false

  root
    .find(j.ArrayExpression)
    .filter((expression) => {
      return expression.parent.value.type === 'ArrayExpression'
    })
    .forEach((expression) => {
      addImport = true
      expression.replace(
        j.callExpression(j.identifier('parallel'), [
          j.arrayExpression(expression.value.elements),
        ])
      )
    })

  if (addImport) {
    root
      .find(j.ImportDeclaration)
      .insertAfter(
        j.importDeclaration(
          [j.importSpecifier(j.identifier('parallel'))],
          j.stringLiteral('cerebral')
        )
      )
  }

  return root.toSource()
}
