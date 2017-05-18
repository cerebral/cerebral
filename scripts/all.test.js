const fs = require('fs')
const glob = require('glob')
const path = require('path')
const execa = require('execa')

function spawnTest (cwd, done) {
  const task = execa('npm', ['run', 'test'], {cwd})
  task.stdout.pipe(process.stdout)
  task.stderr.pipe(process.stderr)
  task.then(
    (result) => done(null, result),
    (err) => done(err)
  )
}

const log = {
  noTests (name) {
    console.log(`\x1b[30m\x1b[46m NO TESTS \x1b[0m - ${name}`)
  },
  pass (name) {
    console.log(`\x1b[30m\x1b[42m     PASS \x1b[0m - ${name}`)
  },
  fail (name) {
    console.log(`\x1b[30m\x1b[41m     FAIL \x1b[0m - ${name}`)
  }
}

function logResults (results) {
  console.log('')
  console.log('***** TEST RESULTS *****\n')
  Object.keys(log).forEach(type => {
    results[type].forEach(packageName => {
      log[type](packageName)
    })
  })
}

glob('@(packages|demos)/*/package.json', (er, files) => {
  const results = {pass: [], fail: [], noTests: [], count: 0}

  const packages = files.map(packagePath => {
    const info = JSON.parse(fs.readFileSync(packagePath))
    const test = info.scripts.test
    return ({name: info.name, path: path.dirname(packagePath), test})
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

  packages.forEach(testInfo => {
    if (!testInfo.test) {
      results.count += 1
      results.noTests.push(testInfo.name)
    } else {
      spawnTest(testInfo.path,
        (err, result) => done(testInfo.name, err, result)
      )
    }
  })
})
