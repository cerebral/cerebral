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
- [Get state](#getstate)

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
let addNewTodo = function (cerebral) {
  let todo = {
    ref: cerebral.ref(),
    title: cerebral.get('newTodoTitle'),
    $isSaving: true
  };
  cerebral.push('todos', todo);
  cerebral.set('newTodoTitle', '');
  return todo.ref;
};

export default addNewTodo;
```
*actions/saveTodo.js*
```js
import ajax from 'ajax';

let saveTodo = function (cerebral, ref) {
  let todo = cerebral.getByRef('todos', ref);
  return ajax.post('/todos', {
    title: todo.title
  })
  .then(function (id) {
    return {
      ref: ref,
      $isSaving: false
    };
  })
  .catch(function (err) {
    return {
      ref: ref,
      $error: err,
      $isSaving: false
    };
  });
};

export default saveTodo;
```
*actions/updateTodo.js*
```js
let updateTodo = function (cerebral, updatedTodo) {
  let todo = cerebral.getByRef('todos', updatedTodo.ref);
  cerebral.merge(todo, updatedTodo);
}
export default updateTodo;
```
### Mutate state
All mutation methods takes a **path** and a **value**. The path can be:

An array
```js
cerebral.push(['admin', 'todos'], {title: 'foo'});
```
A string
```js
cerebral.push('isSaving', true);
```
A state object
```js
let todo = cerebral.get('todos')[0];
cerebral.merge(todo, {
  title: 'Something'
});
```
A combination
```js
let todo = cerebral.get('todos')[0];
cerebral.set([todo, 'title'], 'Something');
```

The examples below will be shown using the *array* syntax.
#### Set
```js
cerebral.set(['user', 'name'], 'foo');
```
#### Unset
```js
cerebral.unset(['user', 'name']);
```
Removes the name key on the user.
#### Merge
```js
cerebral.merge(['user'], {
  name: 'foo',
  age: 30
});
```
#### Merge
```js
cerebral.merge(['user'], {
  name: 'foo',
  age: 30
});
```
#### Push
```js
cerebral.push(['todos'], {
  title: 'foo'
});
```
#### Splice
```js
cerebral.splice(['todos'], 0, 1, {
  title: 'newTodo'
});
```
Note that this works just like the natuve `Array.prototype.splice` method. The last argument is optional.
#### Concat
```js
cerebral.concat(['todos'], [{
  title: 'newTodo1'
}, {
  title: 'newTodo2'
}]);
```
#### Pop
```js
cerebral.pop(['todos']);
```
Removes last item in array.
#### Shift
```js
cerebral.shift(['todos']);
```
Removes first item in array.
#### Unshift
```js
cerebral.unshift(['todos'], {
  title: 'foo'
});
```
Adds item at beginning of array.