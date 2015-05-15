# cerebral (WIP) ![build status](https://travis-ci.org/christianalfoni/cerebral.svg?branch=master)
An intelligent react application framework

<img src="images/logo.jpg" width="300" align="center">

| [API](API.md) |

## Video introductions

- **[Get started - 4:13](http://www.youtube.com/watch?v=Mm4B5F432SQ)**. See how you get started with your Cerebral app. Using a boilerplate you have everything you need for a great workflow and even a server you can put into production.
- **[The debugger - 6:36](https://www.youtube.com/watch?v=K9HLc6xGqX4)**. We take a look at the debugger for the cerebral framework.

## Cerebral - The abstraction
Read this article introducing Cerebral: [Cerebral developer preview](https://github.com/christianalfoni/EmptyBox/blob/master/drafts/2015_05_12_Cerebral-developer-preview.md) (WIP)

## Short history
I have been writing about, researching and developing both traditional and Flux architecture for quite some time. Look at my blog [www.christianalfoni.com](http://www.christianalfoni.com) for more information. Though I think we are moving towards better abstractions for reasoning about our applications there are core issues that are yet to be solved. This library is heavily inspired by articles, videos, other projects and my own experiences building applications.

## Contributors
- Logo and illustrations - **Petter Stenberg Hansen**
- Article review - **Jesse Wood**

Thanks guys!

## Core features
- An architecture inspired by Flux and Baobab
- A single object for all application state
- One way flow of state
- Has complete control of your application state flow using signals
- Can retrace state changes live in the UI
- Specific concepts for handling asynchronous code and relational data
- Immutable data
- A functional approach to interactions
- Gives errors on invalid code
- Requires React as your UI layer

## Creating an application
All examples are shown in ES6 code.

You can use the [cerebral-boilerplate](https://github.com/christianalfoni/cerebral/edit/master/README.md) to quickly get up and running. It is a Webpack and Express setup.

### Create a cerebral
*cerebral.js*
```js
import Cerebral from 'cerebral';

let state = {
  todos: [],
  newTodoTitle: ''
};

export default Cerebral(state);
```
You instantiate a cerebral simply by passing an object representing the initial state of the cerebral.

### Create a signal
*main.js*
```js
import cerebral from './cerebral.js';
import changeNewTodoTitle from './actions/changeNewTodoTitle.js';
import addNewTodo from './actions/addNewTodo.js';

cerebral.signal('newTodoTitleChanged', changeNewTodoTitle);
cerebral.signal('newTodoSubmitted', addNewTodo);
```
A signal can be triggered by any component. The name of a signal should be "what triggered the signal". A signal can have multiple actions related to them, always being triggered one after the other, in the order your provide the actions.

### Create actions
*actions/changeNewTodoTitle.js*
```js
let changeNewTodoTitle = function (cerebral, title) {
  cerebral.set('newTodoTitle', title);
};

default export changeNewTodoTitle;
```
*actions/addNewTodo.js*
```js
let addNewTodo = function (cerebral) {
  cerebral.push('todos', {
    title: cerebral.get('newTodoTitle'),
    created: Date.now()
  });
  cerebral.set('newTodoTitle', '');
};

default export addNewTodo;
```
An action is named "what to do with the signal". An action is by default **synchronous** and any value returned will be passed to the next action. An action always receives the **cerebral** as the first argument. 

### Create a UI
*App.js*
```js
import React from 'react';
import mixin from 'cerebral/mixin';

let App = React.createClass({
  mixins: [mixin],
  getCerebralState() {
    return ['todos', 'newTodoTitle'];
  },
  renderItem(todo, index) {
    return (
      <li key={index}>{todo.title}</li>
    );
  },
  onNewTodoSubmitted(event) {
    event.preventDefault();
    this.signals.newTodoTitleSubmitted();
  },
  onNewTodoTitleChanged(event) {
    this.signals.newTodoTitleChanged(event.target.title);
  },
  render() {
    return (
      <div>
        <form onSubmit={this.onNewTodoSubmitted}>
          <input type="text" onChange={this.onNewTodoTileChanged} value={this.state.newTodoTitle}/>
        </form>
        <ul>
          {this.state.todos.map(this.renderItem)}
        </ul>
      </div>
    );
  }
});

export default App;
```
The **mixin** allows you to expose state from the **cerebral** to the component. You do that by returning an array with paths or an object with key/path. The mixin includes a **PureRenderMixin** that checks changes to the state and props of the component, to avoid unnecessary renders. This runs really fast as the **cerebral** is immutable.

### Inject the cerebral into the app
*main.js*
```js
import React from 'react';
import cerebral from './cerebral.js';
import changeNewTodoTitle from './actions/changeNewTodoTitle.js';
import addNewTodo from './actions/addNewTodo.js';
import App from './App.js';

cerebral.signal('newTodoTitleChanged', changeNewTodoTitle);
cerebral.signal('newTodoTitleSubmitted', addNewTodo);

let Wrapper = cerebral.injectInto(App);

React.render(<Wrapper/>, document.querySelector('#app'));
```
To expose the **cerebral** to the components you need to inject it. The returned wrapper can be used to render the application. This is also beneficial for isomorphic apps. When not running in a production enviroment the wrapper includes the Cerebral Debugger.

### Handle async actions
*actions/addNewTodo.js*
```js
let addNewTodo = function (cerebral) {
  let todo = {
    ref: cerebral.ref(),
    $isSaving: true,
    title: cerebral.get('newTodoTitle'),
    created: Date.now()
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
      title: todo.title,
      created: todo.created
    })
    .then(function (result) {
      return {
        ref: todo.ref,
        $isSaving: false
      };
    })
    .fail(function (error) {
      return {
        ref: todo.ref,
        $isSaving: false,
        $error: error
      };
    });
};

export default saveTodo;
```
*actions/updateTodo.js*
```js
let updateSavedTodo = function (cerebral, updatedTodo) {

  let todo = cerebral.getByRef('todos', updatedTodo.ref);
  cerebral.merge(todo, updatedTodo);

};

default export updateSavedTodo;
```
*main.js*
```js
import React from 'react';
import cerebral from './cerebral.js';
import changeNewTodoTitle from './actions/changeNewTodoTitle.js';
import addNewTodo from './actions/addNewTodo.js';
import saveTodo from './actions/saveTodo.js';
import updateTodo from './actions/updateTodo.js';
import App from './App.js';

cerebral.signal('newTodoTitleChanged', changeNewTodoTitle);
cerebral.signal('newTodoTitleSubmitted', addNewTodo, saveTodo, updateTodo);

App = cerebral.injectInto(App);

React.render(<App/>, document.body);
```
When you return a **promise** from an action it will become an **async action**. The next action will not be triggered until the async action is done. The value you return in a promise is passed to the next action. You will not be able to **remember** during an async action, but you will be able to **remember** synchronously when it is done. Any mutations to the **cerebral** outside of a signal or in an async callback will throw an error.

Note that values returned from actions will be frozen. You can not change them in the next action. This is due to Cerebrals immutable environment. You can use `cerebral.ref()` to create references on objects to extract them from the cerebral.

### Compose state
*cerebral.js*
```js
import Cerebral from 'cerebral';

let visibleTodos = function () {
  return {
    value: [],
    deps: ['todos'],
    get: function (cerebral, deps, refs) {
      return refs.map(function (ref) {
        return deps.todos.filter(function (todo) {
          return todo.ref === ref;
        }).pop();
      });  
    }
  };
};

let state = {
  todos: [],
  visibleTodos: visibleTodos,
  newTodoTitle: ''
};

export default Cerebral(state);
```

By setting a function as value you are able to modify its behaviour. This is extremely handy with relational data. Very often you want to reference other state to avoid duplicates. The value returned from the function is an object defining the initial value of the state, its dependencies and a `get()` method which will run whenever the state has changed or its dependencies.

Just like our own memory can have complex relationships, so can our application state. Our brain can even create memories if something is missing, this is also possible when composing state. An example of this is if each todo has an **authorId**. If the author is not in our state the `get()` method has to create a temporary state while we go grab the real state from the server. This can be expressed like:

*state/visibleTodos.js*
```js
let visibleTodos = function () {

  return refs.map(function (ref) {

    let todo = cerebral.getByRef('todos', ref).toJS();
    todo.author = cerebral.get('authors')[todo.authorId];

    if (!todo.author) {
      todo.author = {
        id: todo.authorId,
        $isLoading: true
      };
      cerebral.signals.missingAuthor(todo.authorId);
    }

    return todo;

  });
  
};

export default visibleTodos;
```

*cerebral.js*
```js
import Cerebral from 'cerebral';
import visibleTodos from './state/visibleTodos.js';

let state = {
  todos: [],
  visibleTodos: visibleTodos,
  newTodoTitle: ''
};

export default Cerebral(state);
```
The **missingAuthor** signal could go grab the author from the server and update the authors map. That would trigger the `get()` method again and the UI would rerender.

## Remember
What makes **cerebral** truly unique is how you are able to debug it. The signals implementation gives **cerebral** full control of your state flow, even asynchronous flow. That way it is very easy to retrace your steps. By using the built in debugger you can reproduce states very easily and use the logging information to identify how state flows and what changes are made to the state.
