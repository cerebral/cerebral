import {Computed} from 'cerebral'
import {state} from 'cerebral/tags'

export default Computed({
  todos: state`app.todos.**`,
  filter: state`app.filter`
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
