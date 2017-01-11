const fs = require('fs')
const path = require('path')

fs.symlink(path.resolve('node_modules'), path.resolve('electron', 'node_modules'), () => {
  console.log('Symlink created')
})
