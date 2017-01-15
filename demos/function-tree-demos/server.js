const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const users = [{
  id: 1,
  name: 'Christian Alfoni',
  githubUsername: 'christianalfoni'
}, {
  id: 2,
  name: 'Aleksey tha man'
}, {
  id: 3,
  name: 'Brian Fitch'
}, {
  id: 4,
  name: 'Garth Williams'
}]

const assignments = [{
  id: 1,
  title: 'Check out function tree demos',
  assignedTo: [1]
}]

app.get('/assignments', (req, res) => {
  setTimeout(() => {
    res.send(assignments)
  }, 500)
})

app.post('/assignments', (req, res) => {
  const assignment = req.body

  setTimeout(() => {
    assignment.id = assignments.length + 1
    assignments.unshift(assignment)
    res.send({
      id: assignment.id
    })
  }, 500)
})

app.get('/users', (req, res) => {
  setTimeout(() => {
    res.send(users.filter(user => (
      user.name.toLowerCase().indexOf(req.query.name.toLowerCase()) === 0
    ))[0] || null)
  }, 200)
})

app.get('/users/:id', (req, res) => {
  setTimeout(() => {
    res.send(users.filter(user => user.id === Number(req.params.id))[0])
  }, 500)
})

app.listen(4000, () => {
  console.log('Running demo, on localhost:4000')
})
