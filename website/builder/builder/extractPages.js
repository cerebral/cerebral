const path = require('path')
const {readDir} = require('./utils')

module.exports = function () {
  return readDir('pages')
    .then(function (files) {
      return files.reduce(function (filesWithContent, file) {
        const fileName = `${path.basename(file, '.js')}`

        filesWithContent[fileName] = require(`../pages/${file}`).default

        return filesWithContent
      }, {})
    })
}
