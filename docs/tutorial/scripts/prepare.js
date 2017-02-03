/* global rm, mkdir, ls, cp, sed, find */
var path = require('path')
var paths = require('./paths')

function prepare (part) {
  // create a new src folder if does not exist
  var hasSrc = ls(paths.root).reduce(function (currentHasSrc, file) {
    if (file === 'src') {
      return true
    }

    return currentHasSrc
  }, false)

  if (!hasSrc) {
    mkdir(paths.src)
  }

  // remove only source files that do not exist on "parts" folder
  let partsFiles = []
  find(path.join(paths.parts, part, 'src')).forEach(function (file) {
    const filePathPartial = file.replace(path.join(paths.parts, part, 'src'), '')
    if (filePathPartial.length > 0) {
      partsFiles.push(filePathPartial)
    }
  })

  let srcFiles = []
  let srcFilesFullName = []
  find(paths.src).forEach(function (file) {
    const filePathPartial = file.replace(paths.src, '')
    if (filePathPartial.length > 0) {
      srcFiles.push({
        partialPath: filePathPartial,
        fullPath: file
      })
    }
  })

  const strangeFilesToDelete = srcFiles.filter((srcFileObj) => {
    const srcFileExists = partsFiles.find(partFile => partFile === srcFileObj.partialPath)
    return !srcFileExists
  })

  strangeFilesToDelete.forEach(function (srcFileObjToDelete) {
    rm('-rf', srcFileObjToDelete.fullPath)
  })

  // copy files from parts folder
  ls(path.join(paths.parts, part, 'src')).forEach(function (file) {
    cp('-R', path.join(paths.parts, part, 'src', file), paths.src)
  })
  cp(paths.partsIndex, paths.public)
  sed('-i', '%N%', part, paths.publicIndex)
}

module.exports = prepare
