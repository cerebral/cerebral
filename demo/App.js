import React from 'react';
import AddTodo from './components/AddTodo.js';
import TodosList from './components/TodosList.js';
import TodosFooter from './components/TodosFooter.js';
import Cerebral from './../src/decorator.js';

@Cerebral(['visibleTodos', 'todos', 'foo'])
class App extends React.Component {
  render() {
    return (
      <div id="todoapp-wrapper">
      <div>{this.props.foo}</div>
        <section id="todoapp">
          <header id="header">
            <h1>todos</h1>
            <AddTodo/>
          </header>
          
          {this.props.visibleTodos.length ? <TodosList/> : null}        
          {Object.keys(this.props.todos).length ? <TodosFooter/> : null}
        </section>
        <footer id="info">
          <p>Double-click to edit a todo</p>
          <p>Credits:
            <a href="http://christianalfoni.com">Christian Alfoni</a>,
          </p>
          <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
        </footer>
      </div>
    );
  }
}

module.exports = App;