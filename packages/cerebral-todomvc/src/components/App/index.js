import React from 'react'
import { connect } from 'cerebral-view-react'
import NewTodoForm from '../NewTodo'
import TodosList from '../List'
import TodosFooter from '../Footer'
import visibleTodos from '../../computed/visibleTodos.js'

export default connect({
  todos: 'app.list.todos',
  recorder: 'recorder',
  isSaving: 'app.new.isSaving',
  visibleTodos: visibleTodos
}, function App (props) {
  return (
    <div id='todoapp-wrapper'>
      <section id='todoapp'>
        <header id='header'>
          <h1>todos</h1>
          <NewTodoForm />
        </header>

        {props.visibleTodos.length ? <TodosList /> : null}
        {Object.keys(props.todos).length ? <TodosFooter /> : null}
      </section>
      <footer id='info'>
        <p>
          Double-click to edit a todo
        </p>
        <p>
          Credits:
          <a href='http://christianalfoni.com'>Christian Alfoni</a>,
        </p>
        <p>
          Part of <a href='http://todomvc.com'>TodoMVC</a>
        </p>
      </footer>
    </div>
  )
})
