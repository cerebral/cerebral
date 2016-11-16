/* global rm, cp, sed */
var path = require('path')
var paths = require('./paths')
var inquirer = require('inquirer')
var exec = require('child_process').exec
var tutorial = exec('react-scripts start')
var runningInquirer = false

function prepare (part) {
  rm('-rf', paths.src)
  cp('-R', path.join(paths.parts, part, 'src'), paths.root)
  cp(paths.partsIndex, paths.public)
  sed('-i', '%N%', part, paths.publicIndex)
}

function chooseChapter (chapter) {
  inquirer.prompt([{
    type: 'list',
    name: 'chapter',
    message: 'Choose next chapter',
    choices: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'],
    default: chapter
  }]).then(function (answers) {
    console.log('------------------------------')
    console.log('Loading chapter ' + answers.chapter + '...')
    prepare(answers.chapter)
    setTimeout(function () {
      console.log('Chapter loaded, go to browser')
      console.log('------------------------------')
      chooseChapter(answers.chapter)
    }, 1000)
  })
}

console.log('Running development server...')
tutorial.stdout.on('data', function (data) {
  if (data.indexOf('Something is already running') >= 0) {
    console.log('ERROR: Something already running on port 3000')
  }
  if (!runningInquirer && data.indexOf('To create a production') >= 0) {
    console.log('Development server running on localhost:3000')
    runningInquirer = true
    prepare('01')
    chooseChapter('01')
  }
})
tutorial.stderr.on('data', function (data) {
  console.log(data)
})
