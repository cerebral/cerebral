const glob = require('glob')
const fs = require('fs')
const path = require('path')
const packagesGlob = require('./packagesGlob').all
const autofix = process.env.CI === true
  ? false
  : process.argv[2] === '--auto-fix'
const dependencyTypes = ['dependencies', 'devDependencies']
const installCmd = {
  dependencies: 'npm install --save --save-exact',
  devDependencies: 'npm install --save-dev --save-exact',
}

const monorepoPath = '../package.json'
const monorepo = require(monorepoPath)

glob(packagesGlob, (er, files) => {
  const packages = files.map(path => JSON.parse(fs.readFileSync(path)))
  /**
   * type: 'install' | 'conflict' | 'noop'
   * dependency: dependency
   * monoVersion: => version in monorepo
   * version: version to install
   * packages: => key: version-in-package
   */
  const cerebralPackages = Object.keys(packages).reduce((acc, key) => {
    const cerebralPackage = packages[key]
    acc[cerebralPackage.name] = cerebralPackage
    return acc
  }, {})

  let allSuccess = true
  let noConflict = true

  dependencyTypes.forEach(dependencyType => {
    const operations = {}
    packages.forEach(cerebralPackage => {
      const dependencies = cerebralPackage[dependencyType]
      const monodeps = monorepo[dependencyType]
      if (dependencies) {
        Object.keys(dependencies).forEach(dependency => {
          if (cerebralPackages[dependency]) {
            // ignore
            return
          }
          const packageExactVersion = dependencies[dependency]
          const packageVersion = packageExactVersion.replace('^', '')
          const monoVersion = monodeps[dependency]
          let update = operations[dependency]
          if (!update) {
            update = operations[dependency] = {
              dependency,
              monoVersion,
              packages: {},
              type: 'noop',
            }
          }
          update.packages[cerebralPackage.name] = packageExactVersion
          if (!update.version) {
            // No change yet
            if (packageVersion !== update.monoVersion) {
              update.type = 'install'
              update.version = packageVersion
            }
          } else if (update.version === packageVersion) {
            // OK
          } else {
            update.type = 'conflict'
          }
        })
      }
    })

    const toInstall = Object.keys(operations)
      .filter(k => operations[k].type === 'install')
      .map(k => operations[k])

    const conflict = Object.keys(operations)
      .filter(k => operations[k].type === 'conflict')
      .map(k => {
        return operations[k]
      })

    const success = conflict.length === 0 && toInstall.length === 0

    if (!success) {
      console.log('\n')
      console.log(
        `************** ${dependencyType} TEST FAILED ****************`
      )
    }

    if (conflict.length) {
      console.log('')
      console.log(`************** ${dependencyType} CONFLICT ****************`)
      console.log('')
      conflict.forEach(c => console.log(JSON.stringify(c, null, 2)))
    }

    if (toInstall.length) {
      if (autofix) {
        const dependencies = monorepo[dependencyType] || {}
        toInstall.forEach(info => {
          dependencies[info.dependency] = info.version
        })
        monorepo[dependencyType] = dependencies
        console.log('')
        console.log(`************** ${dependencyType} UPDATE **************`)
        console.log('')
        console.log(toInstall.map(info => `${info.dependency}@${info.version}`))
      } else {
        console.log('')
        console.log(
          `************** ${dependencyType} TO INSTALL **************`
        )
        console.log('')
        console.log(
          `${installCmd[dependencyType]} ${toInstall
            .map(info => `${info.dependency}@${info.version}`)
            .join(' ')}`
        )
        console.log('')
      }
    }

    noConflict = noConflict && conflict.length === 0
    allSuccess = allSuccess && (success || (autofix && noConflict))
  })

  if (autofix && noConflict) {
    fs.writeFileSync(
      path.resolve(__dirname, monorepoPath),
      JSON.stringify(monorepo, null, 2) + '\n',
      'utf-8'
    )
  }
  process.exit(allSuccess ? 0 : -1)
})
