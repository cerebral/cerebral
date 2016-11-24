module.exports = function (fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  const cerebralReactImport = root.find(j.ImportDeclaration, {
    source: {
      value: 'cerebral/react'
    }
  })

  const connectSpecifier = cerebralReactImport.find(j.ImportSpecifier, {
    imported: {
      name: 'connect'
    }
  })

  if (!connectSpecifier.length) {
    return null
  }

  const localName = connectSpecifier.get(0).node.local.name

  function updateComputed (nodePath) {
    const node = nodePath.node
    node.properties = node.properties.map(function (prop) {
      if (j.CallExpression.check(prop.value)) {
        if (prop.value.arguments.length) {
          // If we have an object passed to the function,
          // we need to call ".props" instead
          return j.property(
            'init',
            j.identifier(prop.key.name),
            j.callExpression(
              j.memberExpression(
                j.identifier(prop.value.callee.name),
                j.identifier('props')
              ),
              prop.value.arguments
            )
          )
        } else {
          // Otherwise just remove the function call
          prop.value = j.identifier(prop.value.callee.name)
        }
      }
      return prop
    })

    return node
  }

  root.find(j.CallExpression, {
    callee: {
      name: localName
    }
  })
  .find(j.ObjectExpression)
  .replaceWith(updateComputed)

  root.find(j.ClassDeclaration)
    .forEach(function (classDec) {
      const decorators = classDec.get(0).node.decorators
      j(decorators).find(j.CallExpression, {
        callee: {
          name: localName
        }
      })
      .find(j.ObjectExpression)
      .replaceWith(updateComputed)
    })

  return root.toSource()
}
