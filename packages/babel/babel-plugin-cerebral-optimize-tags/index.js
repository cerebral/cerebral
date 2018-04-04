const importNames = ['cerebral/tags']
const allowedImports = ['state', 'props', 'input', 'signal', 'string']

function isValidImportLocation(location) {
  return importNames.indexOf(location.toLowerCase()) >= 0
}

function isAllowedImport(importName) {
  return allowedImports.indexOf(importName.toLowerCase()) >= 0
}

export default function({ types: t }) {
  const optionsMap = {
    state: t.objectExpression([
      t.objectProperty(
        t.stringLiteral('isStateDependency'),
        t.booleanLiteral(true)
      ),
    ]),
    string: t.objectExpression([
      t.objectProperty(t.stringLiteral('hasValue'), t.booleanLiteral(false)),
    ]),
  }
  return {
    pre(path) {
      // Used to track renaming imports in local file
      // eg. import { state as s } from 'cerebral/proxies';
      this.importedTagMap = new Map()
      this.tagId = path.scope.generateUidIdentifier('Tag')
    },
    visitor: {
      ImportDeclaration(path) {
        const { node: { source: { value }, source, $$processed } } = path
        if (
          t.isStringLiteral(source) &&
          isValidImportLocation(value) &&
          $$processed === undefined
        ) {
          let foundImport = false
          // Verify that all imports are allowed and track the localName
          for (const {
            imported: { name: importName } = {},
            local: { name: localName },
          } of path.node.specifiers) {
            if (importName === undefined) {
              continue
            }
            if (isAllowedImport(importName)) {
              foundImport = true
              this.importedTagMap.set(localName, importName)
            } else {
              throw path.buildCodeFrameError(
                `The Tag "${importName}" can't be imported`
              )
            }
          }
          if (!foundImport) {
            return
          }
          path.replaceWith(
            t.importDeclaration(
              [t.importSpecifier(this.tagId, t.identifier('Tag'))],
              t.stringLiteral('cerebral/tags')
            )
          )
          path.node.$$processed = true
        }
      },
      TaggedTemplateExpression(path) {
        const {
          node: { quasi: { quasis, expressions }, tag: { name: localName } },
        } = path
        if (this.importedTagMap.has(localName)) {
          const name = this.importedTagMap.get(localName)
          const options = optionsMap[name]
            ? optionsMap[name]
            : t.identifier('undefined')
          const fnQuasis = quasis.map((e) => t.stringLiteral(e.value.raw))

          path.replaceWith(
            t.newExpression(this.tagId, [
              t.stringLiteral(name),
              options,
              t.arrayExpression(fnQuasis),
              t.arrayExpression(expressions),
            ])
          )
        }
      },
    },
  }
}
