# cerebral (WIP) ![build status](https://travis-ci.org/christianalfoni/cerebral.svg?branch=master)
A modern application framework for React

<img src="images/logo.jpg" width="300" align="center">

Video Preview at: [Immutable-store gets signals and a time machine ](https://www.youtube.com/watch?v=Txpw4wU4BCU)

More video preview at: [Cerebral - a React framework in the making ](https://www.youtube.com/watch?v=tM_K_lR_JT8)

| [API](API.md) |

## Cerebral - The abstraction
Read this article introducing Cerebral: [Cerebral developer preview](https://github.com/christianalfoni/EmptyBox/blob/master/drafts/2015_05_12_Cerebral-developer-preview.md) (WIP)

## Short history
I have been writing about and researching traditional and flux architecture for quite some time. Look at my blog [www.christianalfoni.com](http://www.christianalfoni.com) for more information. Though I think we are moving towards better abstractions for reasoning about our applications there are core issues that are yet to be solved. This library is heavily inspired by articles, videos, other projects and my own experiences building applications.

## Core features
- An architecture inspired by flux and Baobab
- A single object for all application state
- One way flow of state
- Can retrace state changes live in the UI
- Specific concepts for handling asynchronous code and relational data
- Immutable data
- A functional approach to interactions
- Gives errors on invalid code
- Requires React as your UI layer

## Creating an application
All examples are shown in ES6 code using Webpack as module loader. Though the concept is heavily inspired by nerves, impulses etc. it felt weird naming methods as such. So the naming is:

- **cerebral**: The brain
- **state**: Memory
- **signals**: Impulses  
- **actions**: Axons
- **facets**: A composition of memory and/or replacement of lacking memory

Please watch [this video for a complete introduction to **Cerebral**](http://) (SOON!)

You can use the [cerebral-boilerplate](https://github.com/christianalfoni/cerebral/edit/master/README.md) to quickly get up and running. It is a Webpack and Node setup.

### Create a cerebral
*cerebral.js*
```js
import Cerebral from 'cerebral';

var state = {
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
let changeNewTodoTitle = function (cerebral, event) {
  cerebral.set('newTodoTitle', event.target.value);
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

class App extends React.Component {
  getCerebralState() {
    return ['todos', 'newTodoTitle'];
  }
  renderItem(todo, index) {
    return (
      <li key={index}>{todo.title}</li>
    );
  }
  submitNewTodo(event) {
    event.preventDefault();
    this.signals.newTodoTitleSubmitted();
  }
  render() {
    return (
      <div>
        <form onSubmit={this.submitNewTodo}>
          <input type="text" onChange={this.signals.newTodoTitleChanged} value={this.state.newTodoTitle}/>
        </form>
        <ul>
          {this.state.todos.map(this.renderItem)}
        </ul>
      </div>
    );
  }
}

export default mixin(App);
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

React.render(<Wrapper/>, document.body);
```
To expose the **cerebral** to the components you need to inject it. The returned wrapper can be used to render the application. This is also beneficial for isomorphic apps.

### Handle async actions
*actions/addNewTodo.js*
```js
import uuid from 'uuid';

let addNewTodo = function (cerebral) {
  let todo = {
    ref: cerebral.ref(),
    $isSaving: true,
    title: cerebral.get('newTodoTitle'),
    created: Date.now()
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
      title: todo.title,
      created: todo.created
    })
    .then(function (result) {
      return {
        ref: ref,
        $isSaving: false
      };
    })
    .fail(function (error) {
      return {
        ref: ref,
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

Note that we never return state from one action that can be mutated in the next. To reference the same object across actions we use `cerebral.ref()`. This is cerebrals own internal referencing which is helpful both to you as a developer, but also internals of cerebral depends on it.

### Facets
*cerebral.js*
```js
import Cerebral from 'cerebral';

var state = {
  todos: [],
  visibleTodos: [],
  newTodoTitle: ''
};

export default Cerebral(state);
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

cerebral.facet('visibleTodos', ['todos'], function (cerebral, refs) {
  return refs.map(function (ref) {
    return cerebral.getByRef('todos', ref);
  });
});

App = cerebral.injectInto(App);

React.render(<App/>, document.body);
```
**Facets** lets you compose state. This is extremely handy with relational data. If you have an array of todos and only want to show some of them and you want the shown todos to keep in sync with the original array of todos, facets will help you. You create a facet by pointing to the entry state, what state it depends on and a function that returns the actual state. 

Just like our own memory can have complex relationships, so can our application state. Our brain can even create memories if something is missing, this is also possible with a facet. An example of this is if each todo has an **authorId**. If the author is not in our state the facet has to create a temporary state while we go grab the real state from the server. This can be expressed like:

```js
cerebral.facet('visibleTodos', ['todos', 'authors'], function (cerebral, uuids) {

  return uuids.map(function (uuid) {

    let todo = cerebral.get('todos')[uuid].toJS();
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

});
```
The **missingAuthor** signal could go grab the author from the server and update the authors map. That would trigger an update of the facet and the UI would rerender.

## Remember
What makes **cerebral** truly unique is how you are able to debug it. The signals implementation gives **cerebral** full control of your state flow, even asynchronous flow. That way it is very easy to retrace your steps. By using the built in debugger you can reproduce states very easily and use the logging information to identify how state flows and what changes are made to the state.
