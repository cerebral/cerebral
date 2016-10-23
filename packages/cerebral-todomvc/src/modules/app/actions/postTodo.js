function postTodo ({path}) {
  // Simulating posting the todo.data and get an ID from
  // the server. We resolve with the new id
  return new Promise((resolve) => {
    setTimeout(resolve, 2000)
  })
  .then(() => path.success({
    id: Date.now() + parseInt(Math.random() * 1000, 10)
  }))
  // Or error
}

export default postTodo
