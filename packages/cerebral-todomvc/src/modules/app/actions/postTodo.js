function postTodo ({path}) {
  // Simulating posting the todo.data and get an ID from
  // the server. We resolve with the new id
  return new Promise(resolve => {
    setTimeout(
      resolve(path.success({
        id: Date.now() + parseInt(Math.random() * 1000, 10)
      }))
    , 2000)
      // Or error
  })
}

export default postTodo
