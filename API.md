# API

- [Create](#create)
- [Inject](#inject)
- [Mixin](#mixin)
- [Signals](#signals)
- [Compose signals](#composesignals)
- [Mutate state](#mutatestate)
  - [set](#set)
  - [merge](#merge)
  - [push](#push)
  - [splice](#splice)
  - [concat](#concat)
  - [pop](#pop)
  - [shift](#shift)
  - [unshift](#unshift)
- [Extract state](#extractstate)

All examples are shown with ES6 + Webpack syntax. You can of course use normal React syntax and ES5 code.

### Create
*cerebral.js*
```js
import Cerebral from 'cerebral';

let cerebral = Cerebral({
  todos: [],
  visibleTodos: [],
  count: 0,
  newTodoTitle: ''
});

export default cerebral;
```
To create a cerebral just pass the initial state of the application.

### Inject
*App.js*
```js
import React from 'react';

class App extends React.Component {
  render: function () {
    return <h1>Hello world!</h1>
  }
}

export default App;
```
*main.js*
```js
import React from 'react';
import cerebral from './cerebral.js';
import App from './App.js';

let Wrapper = cerebral.injectInto(App);

React.render(<Wrapper/>, document.querySelector('#app'));
```

### Mixin
*App.js*
```js
import React from 'react';
import mixin from 'cerebral/mixin';

class App extends React.Component {
  getCerebralState() {
    return ['todos'];
  }
  renderTodo(todo, index) {
    return (
      <li key={index}>{todo.title}</li>
    );
  }
  render: function () {
    return (
      <ul>
        {this.state.todos.map(this.renderTodo)}
      </ul>
    );
  }
}

export default mixin(App);
```
You can also return an object, using keys to define a custom name for the specific component:
```js
  getCerebralState() {
    return {
      list: ['todos']
    };
  }
```

### Signals
*main.js*
```js
import React from 'react';
import cerebral from './cerebral.js';
import App from './App.js';
import setNewTodoTitle from './actions/setNewTodoTitle.js';

cerebral.signal('newTodoTitleChanged', setNewTodoTitle);

let Wrapper = cerebral.injectInto(App);

React.render(<Wrapper/>, document.querySelector('#app'));
```
*actions/setNewTodoTitle.js*
```js
let setNewTodoTitle = function (cerebral, title) {
  cerebral.set('newTodoTitle', title);
};

export default setNewTodoTitle;
```
*App.js*
```js
import React from 'react';
import mixin from 'cerebral/mixin';

class App extends React.Component {
  getCerebralState() {
    return ['todos', 'newTodoTitle'];
  }
  onNewTitleChange(event) {
    this.signals.newTodoTitleChanged(event.target.value);
  }
  renderTodo(todo, index) {
    return (
      <li key={index}>{todo.title}</li>
    );
  }
  render: function () {
    return (
      <div>
        <input 
          type="text"
          value={this.state.newTodoTitle}
          onChange={this.onNewTitleChange}/>
        <ul>
          {this.state.todos.map(this.renderTodo)}
        </ul>
      </div>
    );
  }
}

export default mixin(App);
```

### Compose signals
*main.js*
```js
import React from 'react';
import cerebral from './cerebral.js';
import App from './App.js';
import setNewTodoTitle from './actions/setNewTodoTitle.js';
import addNewTodo from './actions/addNewTodo.js';
import saveToLocalStorage from './actions/saveToLocalStorage.js';

cerebral.signal('newTodoTitleChanged', setNewTodoTitle);
cerebral.signal('newTodoTitleSubmitted', addNewTodo, saveToLocalStorage);

let Wrapper = cerebral.injectInto(App);

React.render(<Wrapper/>, document.querySelector('#app'));
```
*actions/addNewTodo.js*
```js
let addNewTodo = function (cerebral) {
  cerebral.push('todos', {
    title: cerebral.get('newTodoTitle')
  });
  cerebral.set('newTodoTitle', '');
};

export default addNewTodo;
```
*actions/saveToLocalStorage.js*
```js
let saveToLocalStorage = function (cerebral) {
  localStorage.setItem('todos', JSON.stringify(cerebral.get('todos')));
};

export default saveToLocalStorage;
```
*App.js*
```js
import React from 'react';
import mixin from 'cerebral/mixin';

class App extends React.Component {
  getCerebralState() {
    return ['todos', 'newTodoTitle'];
  }
  onNewTitleChange(event) {
    this.signals.newTodoTitleChanged(event.target.value);
  }
  onSubmit(event) {
    event.preventDefault();
    this.signals.newTodoTitleSubmitted();
  } 
  renderTodo(todo, index) {
    return (
      <li key={index}>{todo.title}</li>
    );
  }
  render: function () {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input 
            type="text"
            value={this.state.newTodoTitle}
            onChange={this.onNewTitleChange}/>
        </form>
        <ul>
          {this.state.todos.map(this.renderTodo)}
        </ul>
      </div>
    );
  }
}

export default mixin(App);
```
### Async signal
*main.js*
```js
import React from 'react';
import cerebral from './cerebral.js';
import App from './App.js';
import setNewTodoTitle from './actions/setNewTodoTitle.js';
import addNewTodo from './actions/addNewTodo.js';
import saveToLocalStorage from './actions/saveToLocalStorage.js';
import saveTodo from './actions/saveTodo.js';

cerebral.signal('newTodoTitleChanged', setNewTodoTitle);
cerebral.signal('newTodoTitleSubmitted', addNewTodo, saveTodo, updateTodo, saveToLocalStorage);

let Wrapper = cerebral.injectInto(App);

React.render(<Wrapper/>, document.querySelector('#app'));
```
*actions/addNewTodo.js*
```js
import uuid from 'uuid';

let addNewTodo = function (cerebral) {
  let todo = {
    uuid: uuid.v1(),
    title: cerebral.get('newTodoTitle'),
    $isSaving: true
  };
  cerebral.push('todos', todo);
  cerebral.set('newTodoTitle', '');
  return todo;
};

export default addNewTodo;
```
*actions/saveTodo.js*
```js
import ajax from 'ajax';

let saveTodo = function (cerebral, todo) {
  return ajax.post('/todos', {
    title: todo.title
  })
  .then(function (id) {
    todo.id = id;
    todo.$isSaving = false;
    return todo;
  })
  .catch(function (err) {
    todo.$error = err;
    todo.$isSaving = false;
    return todo;
  });
};

export default saveTodo;
```
*actions/updateTodo.js*
```js
import ajax from 'ajax';

let updateTodo = function (cerebral, updatedTodo) {
  let todo = cerebral.get('todos').filter(function (todo) {
    return todo.uuid === updatedTodo.uuid;
  }).pop();
  cerebral.merge(todo, updatedTodo);
}
export default updateTodo;
```