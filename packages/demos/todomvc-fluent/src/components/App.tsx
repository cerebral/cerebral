import * as React from 'react';
import { connect } from '../fluent';
import NewTodo from './NewTodo';
import TodosList from './List';
import TodosFooter from './Footer';

export default connect()
  .with(({ state }) => ({
    counts: state.counts.get()
  }))
  .to(
    function App({ counts }) {
      return (
        <div id="todoapp-wrapper">
          <section className="todoapp">
            <header className="header">
              <h1>todos</h1>
              <NewTodo />
            </header>
  
            {!!counts.visible && <TodosList />}
            {!!counts.total && <TodosFooter />}
          </section>
          <footer className="info">
            <p>
              Double-click to edit a todo
            </p>
            <p>
              Credits:
              <a href="http://christianalfoni.com">Christian Alfoni</a>,
            </p>
            <p>
              Part of <a href="http://todomvc.com">TodoMVC</a>
            </p>
          </footer>
        </div>
      );
    }
  );