import React from 'react';
import AddTodo from './components/AddTodo.js';
import TodosList from './components/TodosList.js';
import TodosFooter from './components/TodosFooter.js';
import Cerebral from './../src/decorator.js';

@Cerebral(['visibleTodos', 'todos', 'foo', 'recorder'])
class App extends React.Component {
  record() {
    this.signals.recorder.record();
  }
  stop() {
    this.signals.recorder.stop();
  }
  play() {
    this.signals.recorder.play();
  }
  render() {
    return (
      <div id="todoapp-wrapper">
        <div>
          {
            this.props.recorder.isRecording ? 
            <button className="btn btn-stop" onClick={this.stop.bind(this)}>Stop</button> :
            null
          }
          {
            this.props.recorder.isPlaying ?
            <button className="btn btn-play" disabled>Play</button> :
            null
          }
          {
            !this.props.recorder.isRecording && !this.props.recorder.isPlaying && this.props.recorder.hasRecording ?
            <button className="btn btn-play" onClick={this.play.bind(this)}>Play</button> :
            null
          }
          {
            !this.props.recorder.isRecording && !this.props.recorder.isPlaying && !this.props.recorder.hasRecording ?
            <button className="btn btn-record" onClick={this.record.bind(this)}>Record</button> :
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