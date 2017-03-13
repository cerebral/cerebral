import React from 'react'
import {connect} from 'cerebral/react'
import NewTodoForm from '../NewTodo'
import TodosList from '../List'
import TodosFooter from '../Footer'
import computedCounts from '../../computed/counts'

export default connect({
  counts: computedCounts
},
  function App ({counts}) {
    return (
      <div id='todoapp-wrapper'>
        <section className='todoapp'>
          <header className='header'>
            <h1>todos</h1>
            <NewTodoForm />
          </header>

          {counts.visible ? <TodosList /> : null}
          {counts.total ? <TodosFooter /> : null}
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
