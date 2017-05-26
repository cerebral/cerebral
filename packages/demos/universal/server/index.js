import express from 'express'
import render from './render'

const app = express()

app.get('/', function(req, res) {
  render(req).then(index => res.send(index))
})

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
})
