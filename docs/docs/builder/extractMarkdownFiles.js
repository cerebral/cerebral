const path = require('path')
const MTRC = require('markdown-to-react-components')
const {readFile} = require('./utils')
const config = require('../config.json')

module.exports = function () {
  const sections = Object.keys(config.docs)

  return Promise.all(sections.map(function (section) {
    return Promise.all(config.docs[section].map(function (file) {
      return readFile(`docs/${file}.md`)
    }))
  }))
    .then(function (fileContents) {
      return sections.reduce(function (contentTree, dir, index) {
        contentTree[dir] = config.docs[dir].reduce(function (subContent, contentName, subIndex) {
          const key = path.basename(contentName)

          subContent[key] = MTRC(fileContents[index][subIndex])
          subContent[key].raw = fileContents[index][subIndex]

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
