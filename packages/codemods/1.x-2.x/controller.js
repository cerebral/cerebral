module.exports = function(fileInfo, api) {
  const j = api.jscodeshift
  const root = j(fileInfo.source)

  const modelImports = root.find(j.ImportDeclaration, {
    source: {
      value: 'cerebral/models/immutable',
    },
  })

  if (!modelImports.length) {
    return null
  }

  const modelImportName = modelImports.find(j.Identifier).get(0).node.name

  modelImports.remove()

  const modelInstances = root.find(j.CallExpression, {
    callee: {
      name: modelImportName,
    },
  })

  const objectExpression = modelInstances.find(j.ObjectExpression)
  if (!objectExpression.length) {
    return null
  }

  const expressions = []

  expressions.push(
    j.property(
      'init',
      j.identifier('state'),
      modelInstances.get(0).node.arguments[0]
    )
  )

  // Find any expressions that use the controller variable
  let controllerVariableName = 'controller'

  let controller = root.find(j.VariableDeclarator, {
    init: {
      callee: {
        name: 'Controller',
      },
    },
  })

  if (controller.length) {
    controllerVariableName = controller.get(0).node.id.name
  } else {
    controller = root.find(j.AssignmentExpression, {
      right: {
        callee: { name: 'Controller' },
      },
    })

    controllerVariableName = controller.get(0).node.left.name
  }

  // Find any expressions that use the controller variable
  const controllerExpressions = root.find(j.ExpressionStatement, {
    expression: {
      callee: {
        object: {
          name: controllerVariableName,
        },
      },
    },
  })

  controllerExpressions.forEach(exp => {
    // Fix the name
    const name = exp.value.expression.callee.property.name
      .replace('add', '')
      .toLowerCase()

    let expression = exp.value.expression.arguments[0]

    // Modules are now called, so let's conver them
    // to a call expression
    if (name === 'modules') {
      expression.properties = expression.properties.map(propExp => {
        propExp.value = j.callExpression(j.identifier(propExp.value.name), [])
        return propExp
      })
    }

    expressions.push(j.property('init', j.identifier(name), expression))

    // Remove the existing separated version
    exp.prune()
  })

  modelInstances.replaceWith(j.objectExpression(expressions))

  return root.toSource()
}
