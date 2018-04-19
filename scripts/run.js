const fs = require('fs')
const glob = require('glob')
const path = require('path')
const execa = require('execa')
const npmActions = process.argv[2].split(',') || 'test'
const group = process.argv[3] || 'all'
const packagesGlob = require('./packagesGlob')[group]
const symlinkDir = require('symlink-dir').default
const rootBin = path.join(process.cwd(), 'node_modules', '.bin')
const runSerial =
  process.env['TEST_MODE'] === 'serial' && npmActions.indexOf('test') >= 0
if (!runSerial) {
  // We have more then 10 execa processes.
  require('events').EventEmitter.defaultMaxListeners = 0
}

function runAction(action) {
  return new Promise((resolve, reject) => {
    /** List of available commands.
     */
    const commands = {
      link(packagePath, done) {
        const packageBin = path.join(packagePath, 'node_modules', '.bin')
        symlinkDir(rootBin, packageBin).then(
          () => done(null, true),
          (err) => {
            console.warn(
              `Cannot create symlink '${packageBin}' (there is a directory there probably).`
            )
            done(err)
          }
        )
      },
      npm(cwd, done) {
        const task = execa('npm', ['run', action], { cwd })
        task.stdout.pipe(process.stdout)
        task.stderr.pipe(process.stderr)
        task.then((result) => done(null), (err) => done(err))
      },
    }

    const filters = {
      link(info) {
        return true
      },
      npm(info) {
        return info.script
      },
    }

    /** Which command to run for which action.
     * Default command is `npm [action]` in the package directory.
     */
    const commandNameFromAction = {
      link: 'link',
      default: 'npm',
    }

    const commandName =
      commandNameFromAction[action] || commandNameFromAction.default
    const spawnCommand = commands[commandName]
    const filter = filters[commandName]

    const noActionMessage =
      {
        test: '   NO TESTS',
        coverage: 'NO COVERAGE',
      }[action] || `NO ${action}`

    const log = {
      noAction(name) {
        console.log(`\x1b[30m\x1b[46m ${noActionMessage} \x1b[0m - ${name}`)
      },
      pass(name) {
        console.log(`\x1b[30m\x1b[42m        PASS \x1b[0m - ${name}`)
      },
      fail(name) {
        console.log(`\x1b[30m\x1b[41m        FAIL \x1b[0m - ${name}`)
      },
    }

    function logResults(results) {
      console.log('')
      console.log(`***** ${action} RESULTS *****\n`)
      Object.keys(log).forEach((type) => {
        results[type].forEach((packageName) => {
          log[type](packageName)
        })
      })
    }

    glob(packagesGlob, (er, files) => {
      const results = { pass: [], fail: [], noAction: [], count: 0 }

      const packages = files
        .map((packagePath) => {
          const info = JSON.parse(fs.readFileSync(packagePath))
          const script = info.scripts[action]
          return { name: info.name, path: path.dirname(packagePath), script }
        })
        .filter((p) => p)

      function done(name, err, next) {
        results.count += 1
        if (err) {
          results.fail.push(name)
        } else {
          results.pass.push(name)
        }
        if (results.count === packages.length) {
          // Finished
          logResults(results)
          console.log('')
          results.fail.length > 0 ? reject(results.fail) : resolve()
        } else if (next) {
          next()
        }
      }

      const actions = packages
        .filter((actionInfo) => {
          if (!filter(actionInfo)) {
            results.count += 1
            results.noAction.push(actionInfo.name)
            return false
          } else {
            return true
          }
        })
        .map(
          (actionInfo) =>
            function(next) {
              spawnCommand(actionInfo.path, (err) =>
                done(actionInfo.name, err, next)
              )
            }
        )

      if (runSerial) {
        actions.reduce((prev, fun) => () => fun(prev), () => {})()
      } else {
        actions.forEach((fun) => fun())
      }
    })
  })
}

npmActions
  .reduce((task, npmAction) => {
    return task.then(() => runAction(npmAction))
  }, Promise.resolve())
  .then(() => {
    process.exit(0)
  })
  .catch(() => {
    process.exit(-1)
  })
