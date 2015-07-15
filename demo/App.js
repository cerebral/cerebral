import React from 'react';
import StateComponent from './StateComponent.js';
import AddTodo from './components/AddTodo.js';
import TodosList from './components/TodosList.js';
import TodosFooter from './components/TodosFooter.js';

class App extends StateComponent {
  getStatePaths() {
    return {
      visibleTodos: ['visibleTodos'],
      todos: ['todos']
    };
  }
  record() {
    this.recorder.record(this.context.controller.get([]));
  }
  stop() {
    this.recorder.stop();
  }
  play() {
    this.recorder.seek(0, true);
  }
  render() {
    return (
      <div id="todoapp-wrapper">
        <div>
          {
            this.recorder.isRecording() ?
            <button className="btn btn-stop" onClick={this.stop.bind(this)}>Stop</button> :
            null
          }
          {
            this.recorder.isPlaying() ?
            <button className="btn btn-play" disabled>Play</button> :
            null
          }
          {
            !this.recorder.isRecording() && !this.recorder.isPlaying() && this.recorder.getRecording() ?
            <button className="btn btn-play" onClick={this.play.bind(this)}>Play</button> :
            null
          }
          {
            !this.recorder.isRecording() && !this.recorder.isPlaying() && !this.recorder.getRecording() ?
            <button className="btn btn-record" onClick={this.record.bind(this)}>Record</button> :
            null
          }
        </div>
        <section id="todoapp">
          <header id="header">
            <h1>todos</h1>
            <AddTodo/>
          </header>

          {this.state.visibleTodos.length ? <TodosList/> : null}
          {Object.keys(this.state.todos).length ? <TodosFooter/> : null}
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
