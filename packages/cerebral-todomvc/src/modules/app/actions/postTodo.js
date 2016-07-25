function postTodo ({input, state, output}) {
  // Simulating posting the todo.data and get an ID from
  // the server. We resolve with the new id
  setTimeout(function () {
    output.success({
      id: Date.now() + parseInt(Math.random() * 1000)
    })

    // Or error
  }, 2000)
}

postTodo.async = true
postTodo.outputs = ['success', 'error']

export default postTodo
