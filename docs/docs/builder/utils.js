const fs = require('fs-extra')
const path = require('path')
const babel = require('babel-core')

module.exports = {
  readDir (dirPath) {
    return new Promise(function (resolve, reject) {
      fs.readdir(path.resolve(dirPath), function (error, dirs) {
        if (error) {
          return reject(error)
        }

        resolve(dirs)
      })
    })
  },
  readFile (filePath) {
    return new Promise(function (resolve, reject) {
      fs.readFile(path.resolve(filePath), function (error, file) {
        if (error) {
          return reject(error)
        }

        resolve(file.toString())
      })
    })
  },
  readScript (filePath) {
    return new Promise(function (resolve, reject) {
      babel.transformFile(filePath, {
        presets: [require('babel-preset-es2015')]
      }, function (err, result) {
        if (err) {
          return reject(err)
        }

        resolve(result.code)
      })
    })
  },
  isUrl (string) {
    return string.substr(0, 7) === 'http://' || string.substr(0, 8) === 'https://'
  },
  writeFile (filePath, content) {
    return new Promise(function (resolve, reject) {
      fs.writeFile(path.resolve(filePath), content, 'utf-8', function (error) {
        if (error) {
          return reject(error)
        }

        resolve()
      })
    })
  },
  emptyDir (dirPath) {
    return new Promise(function (resolve, reject) {
      fs.emptyDir(path.resolve(dirPath), function (error) {
        if (error) {
          return reject(error)
        }

        resolve()
      })
    })
  },
  copyDir (fromPath, toPath) {
    return new Promise(function (resolve, reject) {
      fs.copy(path.resolve(fromPath), path.resolve(toPath), function (error) {
        if (error) {
          return reject(error)
        }

        resolve()
      })
    })
  },
  extractRawText (docs) {
    return Object.keys(docs).reduce(function (docsText, sectionKey) {
      docsText[sectionKey] = Object.keys(docs[sectionKey]).reduce(function (subDocsText, subSectionKey) {
        subDocsText[subSectionKey] = {
          raw: docs[sectionKey][subSectionKey].raw,
          title: docs[sectionKey][subSectionKey].toc[0].title
        }

        return subDocsText
      }, {})

      return docsText
    }, {})
  }
}
