import {Computed} from 'cerebral'

export default Computed({
  todos: 'app.todos',
  filter: 'app.filter'
}, props => {
  return Object.keys(props.todos).filter((ref) => {
    const todo = props.todos[ref]

    return (
      props.filter === 'all' ||
      (props.filter === 'completed' && todo.completed) ||
      (props.filter === 'active' && !todo.completed)
    )
  })
})
