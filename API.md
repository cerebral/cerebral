# API

- [Create](#create)
- [Inject](#inject)
- [Mixin](#mixin)
- [Signals](#signals)
- [Async signals](#async-signals)
- [Compose signals](#compose-signals)
- [Compose state](#compose-state)
- [Mutate state](#mutate-state)
  - [set](#set)
  - [merge](#merge)
  - [push](#push)
  - [splice](#splice)
  - [concat](#concat)
  - [pop](#pop)
  - [shift](#shift)
  - [unshift](#unshift)
- [get](#get)
- [toJS](#tojs)
- [ref](#ref)
- [getByRef](#getbyref)

- [getMemories](#getmemories)
- [remember](#remember)

All examples are shown with ES6 syntax. You can of course use normal React syntax and ES5.

### Create
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

let App = React.createClass({
  render() {
    return <h1>Hello world!</h1>
  }
});

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

let App = React.createClass({
  mixins: [mixin],
  getCerebralState() {
    return ['todos'];
  },
  renderTodo(todo, index) {
    return (
      <li key={index}>{todo.title}</li>
    );
  },
  render() {
    return (
      <ul>
        {this.state.todos.map(this.renderTodo)}
      </ul>
    );
  }
});

export default App;
```
You can also return an object, using keys to define a custom name for the specific component:
```js
  getCerebralState() {
    return {
      list: ['todos']
    };
  }
```

With ES6 class syntax you would:
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
  render() {
    return (
      <ul>
        {this.state.todos.map(this.renderTodo)}
      </ul>
    );
  }
}

export default mixin(App);
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

let App = React.createClass({
  getCerebralState() {
    return ['todos', 'newTodoTitle'];
  },
  onNewTitleChange(event) {
    this.signals.newTodoTitleChanged(event.target.value);
  },
  renderTodo(todo, index) {
    return (
      <li key={index}>{todo.title}</li>
    );
  },
  render() {
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
});

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
    $ref: cerebral.ref(),
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
    return {
      $ref: todo.$ref,
      $isSaving: false
    };
  })
  .catch(function (err) {
    return {
      $ref: todo.$ref,
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
  let todo = cerebral.getByRef('todos', updatedTodo.$ref);
  cerebral.merge(todo, updatedTodo);
}
export default updateTodo;
```

You can also run async actions in parallell with:

```js
*main.js*
```js
import React from 'react';
import cerebral from './cerebral.js';
import App from './App.js';
import getUsers from './actions/getUsers.js';
import getProjects from './actions/getProjects.js';
import setInitialState from './actions/setInitialState.js';

cerebral.signal('appRendered', [getUsers, getProjects], setInitialState);

let Wrapper = cerebral.injectInto(App);

React.render(<Wrapper/>, document.querySelector('#app'));
```
`getUsers()` and `getProjects` will run at the same time and when both are done `setInitialState` will run. The value passed is an array of resolved values.

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

let App = React.createClass({
  mixins: [mixin],
  getCerebralState() {
    return ['todos', 'newTodoTitle'];
  },
  onNewTitleChange(event) {
    this.signals.newTodoTitleChanged(event.target.value);
  },
  onSubmit(event) {
    event.preventDefault();
    this.signals.newTodoTitleSubmitted();
  },
  renderTodo(todo, index) {
    return (
      <li key={index}>{todo.title}</li>
    );
  },
  render() {
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
});

export default App;
```

### Compose state
```js
import Cerebral from 'cerebral';

let visibleTodos = function () {
  return {
    value: [],
    deps: ['todos'],
    get(cerebral, deps, refs) {
      return refs.map(function (ref) {
        return deps.todos.filter(function (ref) {
          return todo.ref === ref;
        }).pop();
      });
    }
  };
};

let cerebral = Cerebral({
  todos: [],
  visibleTodos: visibleTodos,
  count: 0,
  newTodoTitle: ''
});

export default cerebral;
```
In this example we have an array of `visibleTodos`. This array will contain references to todos in the `todos` array. Whenever the changes are done to either arrays the callback will run and any components using the state will update with the new value.

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

#### set
```js
cerebral.set(['user', 'name'], 'foo');
```

#### unset
```js
cerebral.unset(['user', 'name']);
```
Removes the name key on the user.

#### merge
```js
cerebral.merge(['user'], {
  name: 'foo',
  age: 30
});
```

#### push
```js
cerebral.push(['todos'], {
  title: 'foo'
});
```

#### splice
```js
cerebral.splice(['todos'], 0, 1, {
  title: 'newTodo'
});
```
Note that this works just like the natuve `Array.prototype.splice` method. The last argument is optional.

#### concat
```js
cerebral.concat(['todos'], [{
  title: 'newTodo1'
}, {
  title: 'newTodo2'
}]);
```

#### pop
```js
cerebral.pop(['todos']);
```
Removes last item in array.

#### shift
```js
cerebral.shift(['todos']);
```
Removes first item in array.

#### unshift
```js
cerebral.unshift(['todos'], {
  title: 'foo'
});
```
Adds item at beginning of array.

### get
```js
cerebral.get('todos');
cerebral.get(['user', 'name']);
```

### ref
```js
let todo = {
  ref: cerebral.ref(),
  title: 'foo'
};
```
Use Cerebral refs to create unique IDs in the client. It is important that you use Cerebrals internal reference implementation as the IDs will be created chronologically.

### getByRef
```js
let todo = cerebral.getByRef('todos', todo.$ref);
```
Values returned from cerebral are immutable!

### toJS
```js
let todo = cerebral.get('todos', 0);
todo.title; // "foo"
todo.title = 'bar';
todo.title; // "foo"
let copy = todo.toJS();
copy.title = 'bar';
copy.title; // "bar"
```

### getMemories
```js
let memories = getMemories();
```
Returns an array of signals. Each signal has an array of actions. Each actions has an array of mutations. Have fun!

### remember
```js
cerebral.remember(-1); // Go to beginning
cerebral.remember(5); // Remember up to signal 5
```
