const path = require('path')
const { readFile, fileExistsSync } = require('./utils')
const config = require('../config.json')
const compile = require('./compile')

module.exports = function() {
  const sections = Object.keys(config.docs)

  return Promise.all(
    sections.map(function(section) {
      return Promise.all(
        config.docs[section].map(function(file) {
          return readFile(
            typeof file === 'string' ? `${file}.md` : `${file.path}.md`
          )
        })
      )
    })
  )
    .then(function(fileContents) {
      return sections.reduce(function(contentTree, dir, index) {
        contentTree[dir] = config.docs[dir].reduce(function(
          subContent,
          contentName,
          subIndex
        ) {
          const name = contentName.name || path.basename(contentName)
          const key = subIndex === 0 ? 'index' : name
          const content = (
            fileContents[index][subIndex].match(/\[.*?]\(.*?\)/g) || []
          )
            .map((markdownLink) => {
              return markdownLink.match(/\((.*)\)/).pop()
            })
            .filter((filePath) => {
              try {
                return fileExistsSync(path.resolve('docs', dir, filePath))
              } catch (e) {
                return false
              }
            })
            .reduce((currentContent, filePath) => {
              return currentContent.replace(
                `(${filePath})`,
                `(${path.dirname(filePath) +
                  '/' +
                  path.basename(filePath, '.md')}.html)`
              )
            }, fileContents[index][subIndex])

          subContent[key] = compile(content)
          subContent[key].raw = content
          subContent[
            key
          ].githubUrl = `https://github.com/cerebral/cerebral/tree/next/${(
            contentName.path || contentName
          )
            // TODO: implement correct url generation
            .replace('../../../', '')
            .replace('../../', 'packages/')}.md`

          return subContent
        },
        {})

        return contentTree
      }, {})
    })
    .catch(function(error) {
      console.log('Unable to extract markdown')
      console.error(error)
    })
}
