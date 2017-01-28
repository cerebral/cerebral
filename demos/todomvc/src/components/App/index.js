import React from 'react'
import { connect } from 'cerebral/react'
import {state} from 'cerebral/tags'
import NewTodoForm from '../NewTodo'
import TodosList from '../List'
import TodosFooter from '../Footer'
import Recorder from '../Recorder'
import counts from '../../computed/counts'

export default connect({
  isSaving: state`app.isSaving`,
  counts
},
  ({ isSaving, counts }) => ({
    isSaving,
    hasVisibleTodos: !!counts.visible,
    hasTodos: !!counts.total
  }),
  function App ({ isSaving, hasVisibleTodos, hasTodos }) {
    return (
      <div id='todoapp-wrapper'>
        <Recorder />
        <section className='todoapp'>
          <header className='header'>
            <h1>todos</h1>
            <NewTodoForm />
          </header>

          {hasVisibleTodos && <TodosList />}
          {hasTodos && <TodosFooter />}
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
