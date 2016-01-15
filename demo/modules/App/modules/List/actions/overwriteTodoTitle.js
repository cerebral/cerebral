function overwriteTodoTitle({input, module}) {
  const todo = ['todos', input.ref];
  module.state.set([...todo, 'title'], module.state.get([...todo, '$newTitle']))
}

export default overwriteTodoTitle;
