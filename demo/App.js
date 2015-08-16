import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react';
import AddTodo from './components/AddTodo.js';
import TodosList from './components/TodosList.js';
import TodosFooter from './components/TodosFooter.js';

@Cerebral({
  visibleTodos: ['visibleTodos'],
  todos: ['todos']
})
class App extends React.Component {
  record() {
    this.props.recorder.record(this.props.get().export());
  }
  stop() {
    this.props.recorder.stop();
  }
  play() {
    this.props.recorder.seek(0, true);
  }
  render() {
    return (
      <div id="todoapp-wrapper">
        <div>
          {
            this.props.recorder.isRecording() ?
            <button className="btn btn-stop" onClick={() => this.stop()}>Stop</button> :
            null
          }
          {
            this.props.recorder.isPlaying() ?
            <button className="btn btn-play" disabled>Play</button> :
            null
          }
          {
            !this.props.recorder.isRecording() && !this.props.recorder.isPlaying() && this.props.recorder.getRecording() ?
            <button className="btn btn-play" onClick={() => this.play()}>Play</button> :
            null
          }
          {
            !this.props.recorder.isRecording() && !this.props.recorder.isPlaying() && !this.props.recorder.getRecording() ?
            <button className="btn btn-record" onClick={() => this.record()}>Record</button> :
            null
          }
        </div>
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
