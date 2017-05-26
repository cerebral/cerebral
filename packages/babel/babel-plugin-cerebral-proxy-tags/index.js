const importNames = ['cerebral/proxies', 'cerebral-proxy-tags']
const allowedImports = ['state', 'props', 'input', 'signal']

function isValidImportLocation(location) {
  return importNames.indexOf(location.toLowerCase()) >= 0
}

function isAllowedImport(importName) {
  return allowedImports.indexOf(importName.toLowerCase()) >= 0
}

function isTagValidInThisScope(scope, name) {
  const binding = scope.getBinding(name)
  return binding && binding.kind === 'module'
}

function isPlainPropertyAccess(t, property, computed) {
  return (
    (t.isIdentifier(property) && computed === false) ||
    (t.isLiteral(property) && property.value)
  )
}

export default function({ types: t }) {
  return {
    pre() {
      // Used to track renaming imports in local file
      // eg. import { state as s } from 'cerebral/proxies';
      this.importedTagSet = new Set()
    },
    visitor: {
      ImportDeclaration(path) {
        const { node: { source: { value }, source } } = path
        if (t.isStringLiteral(source) && isValidImportLocation(value)) {
          // Verify that all imports are allowed and track the localName
          for (const {
            imported: { name: importName } = {},
            local: { name: localName },
          } of path.node.specifiers) {
            if (importName === undefined) {
              continue
            }
            if (isAllowedImport(importName)) {
              this.importedTagSet.add(localName)
            } else {
              throw path.buildCodeFrameError(
                `The Tag "${importName}" can't be imported`
              )
            }
          }
          // Change import to the real 'cerebral/tags';
          path.node.source.value = 'cerebral/tags'
        }
      },
      MemberExpression(path) {
        // Always use the innermost MemberExpression
        if (!t.isIdentifier(path.node.object)) {
          return
        }

        const tagName = path.node.object.name

        if (
          !this.importedTagSet.has(tagName) ||
          !isTagValidInThisScope(path.scope, tagName)
        ) {
          return
        }

        let quasi = []
        let quasis = [quasi]
        let expressions = []
        let prevWasExpression = false

        let rootMemberExpression
        let currentMember = path

        // Iterate trough all parents
        while (t.isMemberExpression(currentMember)) {
          const { node: { property, computed } } = currentMember

          // Plain id like state.a[1].b['test']
          if (isPlainPropertyAccess(t, property, computed)) {
            const value = t.isLiteral(property) ? property.value : property.name
            quasi.push(
              (quasi.length !== 0 || prevWasExpression ? '.' : '') + value
            )
            prevWasExpression = false
            // Nested expressions like state.a[state.b]
          } else {
            quasi.push('.')
            expressions.push(property)
            quasi = []
            quasis.push(quasi)
            prevWasExpression = true
          }

          // Save the rootMember
          rootMemberExpression = currentMember

          // Advance to next parent
          currentMember = currentMember.parentPath
        }

        // Replace the rootMemberExpression
        // with the TaggedTemplate
        rootMemberExpression.replaceWith(
          t.taggedTemplateExpression(
            t.identifier(tagName),
            t.templateLiteral(
              quasis.map(v => {
                const str = v.join('')
                return t.templateElement({ raw: str, cooked: str })
              }),
              expressions
            )
          )
        )
      },
    },
  }
}
