const fs = require('fs')
const path = require('path')
const glob = require('glob')
const { createCoverageMap } = require('istanbul-lib-coverage')
const libReport = require('istanbul-lib-report')
const reports = require('istanbul-reports')

const COVERAGE_FILENAME = 'coverage-final.json'
const GLOB_PATTERN = path.join('packages', '**', 'coverage', COVERAGE_FILENAME)

function getCoverageFiles(pattern) {
  return glob.sync(pattern)
}

function mergeCoverageFiles(files) {
  const map = createCoverageMap({})
  files.forEach((file) => {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'))
      map.merge(data)
    } catch (err) {
      console.error(`Error processing ${file}:`, err)
    }
  })
  return map
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function generateReports(coverageMap, outputDir) {
  const context = libReport.createContext({
    dir: outputDir,
    coverageMap,
  })
  reports.create('lcov').execute(context)
  reports.create('text-summary').execute(context)
}

function main() {
  // Parse command line for the -d option to override output directory
  const args = process.argv.slice(2)
  let outputDir = 'coverage' // default
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-d' && args[i + 1]) {
      outputDir = args[i + 1]
      break
    }
  }
  const OUTPUT_DIR = outputDir
  const OUTPUT_FILE = path.join(OUTPUT_DIR, COVERAGE_FILENAME)

  const files = getCoverageFiles(GLOB_PATTERN)
  const coverageMap = mergeCoverageFiles(files)

  ensureDir(OUTPUT_DIR)
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(coverageMap.toJSON(), null, 2),
    'utf8'
  )

  generateReports(coverageMap, OUTPUT_DIR)
}

main()
