const React = require('react')
const path = require('path')
const MTRC = require('markdown-to-react-components')
const {readFile, fileExistsSync} = require('./utils')
const config = require('../config.json')

MTRC.configure({
  a: React.createClass({
    render () {
      return <a href={this.props.href} target={this.props.href.substr(0, 4) === 'http' ? 'new' : null}>{this.props.children}</a>
    }
  })
})

module.exports = function () {
  const sections = Object.keys(config.docs)

  return Promise.all(sections.map(function (section) {
    return Promise.all(config.docs[section].map(function (file) {
      return readFile(`docs/${section}/${file}.md`)
    }))
  }))
    .then(function (fileContents) {
      return sections.reduce(function (contentTree, dir, index) {
        contentTree[dir] = config.docs[dir].reduce(function (subContent, contentName, subIndex) {
          const key = contentName
          const content = (fileContents[index][subIndex].match(/\[.*?]\(.*?\)/g) || [])
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
              return currentContent.replace(`(${filePath})`, `(${path.dirname(filePath) + '/' + path.basename(filePath, '.md')}.html)`)
            }, fileContents[index][subIndex])

          subContent[key] = MTRC(content)
          subContent[key].raw = content

          return subContent
        }, {})

        return contentTree
      }, {})
    })
    .catch(function (error) {
      console.log('Unable to extract markdown')
      console.error(error)
    })
}
