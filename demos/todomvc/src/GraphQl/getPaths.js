import {parse} from 'graphql'

function traverse (data, visit) {
  if (Array.isArray(data)) {
    data.forEach((dataItem) => {
      look(dataItem, visit)
    })
  } else {
    look(data, visit)
  }
}

function look (data, visit) {
  for (let key in data) {
    if (key === 'kind') {
      const next = visit(data[key])

      next && next.before && next.before(data)

      if (next && next.key) {
        traverse(data[next.key], visit)
      }

      next && next.after && next.after(data)
    }
  }
}

function getPaths (query) {
  const ast = parse(query)
  const path = []
  const paths = []

  traverse(ast.definitions, (kind) => {
    switch (kind) {
      case 'Document':
        return {key: 'definitions'}
      case 'OperationDefinition':
        return {key: 'selectionSet'}
      case 'SelectionSet':
        return {key: 'selections'}
      case 'Field':
        return {
          before (data) {
            path.push(data.name.value)
            if (!data.selectionSet) {
              paths.push(path.slice())
            }
          },
          after (data) {
            path.pop()
          },
          key: 'selectionSet'
        }
    }
  })

  console.log(paths);

  return paths
}

export default getPaths
