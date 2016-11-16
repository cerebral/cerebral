/* global ls, test */
var paths = require('./paths')
var inquirer = require('inquirer')
var exec = require('child_process').exec
var tutorial = exec('react-scripts start')
var prepare = require('./prepare')
var runningInquirer = false

function chooseChapter (chapter) {
  inquirer.prompt([{
    type: 'list',
    name: 'chapter',
    message: 'Choose next chapter',
    choices: ls('-d', paths.parts + '/*')
      .filter(function (item) { return test('-d', item) })
      .map(function (dir) { return dir.split('/').slice(-1)[0] }),
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
