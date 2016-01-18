import React from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import SimpleRecorder from 'cerebral-module-recorder/react/SimpleRecorder';
import NewTodoForm from '../../modules/NewTodo/components/NewTodo';
import TodosList from '../../modules/List/components/List';
import TodosFooter from '../../modules/Footer/components/Footer';
import visibleTodos from '../../modules/List/computed/visibleTodos.js';

@Cerebral({
  todos: ['app', 'list', 'todos'],
  recorder: ['recorder'],
  isSaving: ['app', 'new', 'isSaving'],
  visibleTodos: visibleTodos
})
class App extends React.Component {
  record() {
    this.props.signals.recorder.recorded({
      paths: [
        ['app'],
        ['refs']
      ]
    });
  }
  stop() {
    this.props.signals.recorder.stopped();
  }
  play() {
    this.props.signals.recorder.played();
  }
  render() {
    return (
      <div id="todoapp-wrapper">
        <div>
          <SimpleRecorder/>
        </div>
        <section id="todoapp">
          <header id="header">
            <h1>todos</h1>
            <NewTodoForm/>
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
