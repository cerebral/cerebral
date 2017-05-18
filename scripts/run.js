const fs = require('fs')
const glob = require('glob')
const path = require('path')
const execa = require('execa')
const action = process.argv[2] || 'test'

function spawnCommand (cwd, done) {
  const task = execa('npm', ['run', action], {cwd})
  task.stdout.pipe(process.stdout)
  task.stderr.pipe(process.stderr)
  task.then(
    (result) => done(null, result),
    (err) => done(err)
  )
}

const noActionMessage = {
  test: '   NO TESTS',
  coverage: 'NO COVERAGE'
}[action] || `NO ${action}`

const log = {
  noAction (name) {
    console.log(`\x1b[30m\x1b[46m ${noActionMessage} \x1b[0m - ${name}`)
  },
  pass (name) {
    console.log(`\x1b[30m\x1b[42m        PASS \x1b[0m - ${name}`)
  },
  fail (name) {
    console.log(`\x1b[30m\x1b[41m        FAIL \x1b[0m - ${name}`)
  }
}

function logResults (results) {
  console.log('')
  console.log(`***** ${action} RESULTS *****\n`)
  Object.keys(log).forEach(type => {
    results[type].forEach(packageName => {
      log[type](packageName)
    })
  })
}

glob('@(packages|demos)/*/package.json', (er, files) => {
  const results = {pass: [], fail: [], noAction: [], count: 0}

  const packages = files.map(packagePath => {
    const info = JSON.parse(fs.readFileSync(packagePath))
    const script = info.scripts[action]
    return ({name: info.name, path: path.dirname(packagePath), script})
  }).filter(p => p)

  function done (name, err, result) {
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
      process.exit(results.fail.length > 0 ? -1 : 0)
    }
  }

  packages.forEach(actionInfo => {
    if (!actionInfo.script) {
      results.count += 1
      results.noAction.push(actionInfo.name)
    } else {
      spawnCommand(actionInfo.path,
        (err, result) => done(actionInfo.name, err, result)
      )
    }
  })
})
