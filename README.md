# cerebral (WIP)
A modern application framework for React

Preview at: [Immutable-store gets signals and a time machine ](https://www.youtube.com/watch?v=Txpw4wU4BCU)

More preview at: [Cerebral - a React framework in the making ](https://www.youtube.com/watch?v=tM_K_lR_JT8)

| [API](API.md) |

## Cerebral - the abstraction
If your application was a person you interacted with, **cerebral** would be the brain and the nervous system of that person.

Imagine how you interact with a person. You can interact in different ways, like talking, waving your arms or give a hug. The other person experiences these interactions as impulses that goes through the nervous system to the brain, where they are processed and stored. This is exactly how **cerebral** imagines your application, though the interactions are mouse clicks, keyboard presses etc. that are sent with signals to a single application store.

So imagine your application as a human. The way we traditionally have built applications is having many "persons" (views) that can be interacted with. They have their own brain (state) and logic for handling interactions (events). This quickly becomes very complex and difficult to manage. The reason is that each "person" being interacted with operates in isolation and can not share their information. You have to create a system to share information and keep everyone informed. In real life  this is a huge challenge. It is difficult to keep a group of people in complete sync, and your application is no different. 

With the flux architecture we conceptually moved away from dealing with a group of people to having one person handling all interaction and state changes. But in a flux architecture this person has a split personality. Multiple stores has different responsibilities and are dependant on each other, much like our traditional architecture. This is difficult to manage, though the result is much more scalable and easier to reason with.

With **cerebral** your application is truly "one person". Think of your components as the body of your application, and cerebral as the brain and the nervous system. The user interacts with the body (UI) which passes impulses (signals) to the brain (cerebral). These impulses are processed by one or multiple axons (actions) and stored. Unlike traditional analogies of handling state and interactions as something "outside the components", think of **cerebral** as something "inside the components". This will make a lot of sense when you look at the code!

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
- Loves React

## Creating an application
All examples are shown in ES6 code using Webpack as module loader. Though the concept is heavily inspired by nerves, impulses etc. it felt weird naming methods as such. So the naming is:

- **cerebral**: The brain
- **state**: Memory
- **signals**: Impulses  
- **actions**: Axons
- **facets**: A composition of memory and/or replacement of lacking memory

Please watch [this video for a complete introduction to **Cerebral**](http://)


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
The **mixin** allows you to expose state from the **cerebral** to the component. You do that by returning an array with paths or an object with key/path. The mixins includes a **PureRenderMixin** that checks changes to the state and props of the component, to avoid unnecessary renders. This is really fast as the **cerebral** is immutable.

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

App = cerebral.injectInto(App);

React.render(<App/>, document.body);
```
To expose the **cerebral** to the components you need to inject it. The returned wrapper can be used to render the application. This is also beneficial for isomorphic apps.

### Handle async actions
*actions/addNewTodo.js*
```js
import uuid from 'uuid';

let addNewTodo = function (cerebral) {
  let todo = {
    uuid: uuid.v1(),
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
      todo.$isSaving = false;
      return todo;
    })
    .fail(function (error) {
      todo.$isSaving = false;
      todo.$error = error;
      return todo;
    });
};

export default saveTodo;
```
*actions/updateTodo.js*
```js
let updateSavedTodo = function (cerebral, updatedTodo) {

  let todo = cerebral.get('todos').filter(function (todo) {
    return todo.uuid === updatedTodo.uuid;
  }).pop();
  
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
When you return a **promise** from an action it will become an **async action**. The next action will not be triggered until the async action is done. The value you return in a promise is passed to the next action. You will not be able to **remember** during an async action, but you will be able to **remember** syncrhonously when it is done. Any mutations to the **cerebral** outside of a signal or in an async callback will throw an error.

### Facets
*cerebral.js*
```js
import Cerebral from 'cerebral';

var state = {
  todos: {},
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

cerebral.facet('visibleTodos', ['todos'], function (cerebral, uuids) {
  return uuids.map(function (uuid) {
    return cerebral.get('todos')[uuid];
  });
});

App = cerebral.injectInto(App);

React.render(<App/>, document.body);
```
**Facets** lets you compose state. This is extremely handy with relational data. If you have a map of todos and only want to show some of them and you want the shown todos to keep in sync with the map of todos, facets will help you. You create a facet by pointing to the entry state, what state it depends on and a function that returns the actual state. 

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
