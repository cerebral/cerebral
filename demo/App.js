import React from 'react';
import AddTodo from './components/AddTodo.js';
import TodosList from './components/TodosList.js';
import TodosFooter from './components/TodosFooter.js';
import TimeTraveller from './TimeTraveller.js';
import mixin from './../src/mixin.js';

var App = React.createClass({
  getCerebralState: function () {
    return ['visibleTodos'];
  },
  render: function() {
    return (
      <div>
        <section id="todoapp">
          <header id="header">
            <h1>todos</h1>
            <AddTodo/>
          </header>
          
          {this.state.visibleTodos.length ? <TodosList/> : null}
          {/*
          {state.todos.length ? <TodosFooter/> : null}
        */}
        </section>
        {/*
        <footer id="info">
          <p>Double-click to edit a todo</p>
          <p>Credits:
            <a href="http://christianalfoni.com">Christian Alfoni</a>,
          </p>
          <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
        */}
        <TimeTraveller/>
      </div>
    );
  }
});

module.exports = mixin(App);