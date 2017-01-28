import React from 'react'
import { connect } from 'cerebral/react'
import {state} from 'cerebral/tags'
import NewTodoForm from '../NewTodo'
import TodosList from '../List'
import TodosFooter from '../Footer'
import Recorder from '../Recorder'
import visibleTodosRefs from '../../computed/visibleTodosRefs'
import isAllChecked from '../../computed/isAllChecked'

const AllChecked = connect({
  isAllChecked
}, ({isAllChecked}) => <span>isAllChecked: {String(isAllChecked)}</span>)

export default connect({
  todos: state`app.todos`,
  isSaving: state`app.isSaving`,
  visibleTodosRefs: visibleTodosRefs
},
  function App (props) {
    return (
      <div id='todoapp-wrapper'>
        <Recorder />
        <AllChecked />
        <section className='todoapp'>
          <header className='header'>
            <h1>todos</h1>
            <NewTodoForm />
          </header>

          {props.visibleTodosRefs.length ? <TodosList /> : null}
          {Object.keys(props.todos).length ? <TodosFooter /> : null}
        </section>
        <footer className='info'>
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
  }
)
