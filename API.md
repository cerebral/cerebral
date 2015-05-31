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
  - [create](#create)
  - [update](#update)
  - [get](#update)
  - [remove](#update)
- [getMemories](#getmemories)
- [remember](#remember)
- [recording](#recording)

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

// Supports namespacing signals
cerebral.signal('titles.newTodoTitleChanged', setNewTodoTitle);

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
    initialState: [],
    lookupState: ['todos'],
    get(cerebral, lookupState, refs) {
      return refs.map(function (ref) {
        return lookupState.todos[ref];
      });
    }
  };
};

let cerebral = Cerebral({
  todos: {},
  visibleTodos: visibleTodos,
  count: 0,
  newTodoTitle: ''
});

export default cerebral;
```
In this example we have an array of `visibleTodos`. This array will contain references to todos in the `todos` map. See video []() on how to structure state. Whenever the changes are done to either the array or the map, the callback will run and any components using the state will update with the new value.

**Note!** You should not trigger new signals inside this mapping function. They are run on instantiation where signals are not available and you risk causing circular conditions.

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
Cerebral has a reference implementation. The reason it has this implementation is for you to easily do optimistic updates, relational data and general lookups in the cerebral. Lets us first look at the four methods and then look at a scenario.

#### create
```js
let ref = cerebral.ref.create();
```
Returns a reference value created by the cerebral.

```js
let ref = cerebral.ref.create(foo.id);
```
Returns a reference value that is now linked with the id of foo.

#### update
```js
let ref = cerebral.ref.create();
cerebral.ref.update(ref, foo.id);
```
Links an id to the ref.

#### get
```js
let ref = cerebral.ref.get(foo.id);
```
Return the ref related to the id of foo.

#### remove
```js
cerebral.ref.remove(ref);
cerebral.ref.remove(foo.id);
```
Both these removes the ref and linked id.

##### So why use this?
When you download and update data in the client you should put that data in a map (object) and use arrays to display that data. The reason is that these gives you a data storage of sorts. Displaying data will be used by referencing this source data. To give complete control of all this referencing you can use Cerebrals implementation.

Let us optimistically update our application with a new todo.
```js
let addTodo = function (cerebral) {
  let ref = cerebral.ref.create();
  let todo = {
    $isSaving: true,
    title: cerebral.get('newTodoTitle'),
    completed: false
  };
  cerebral.set(['todos', ref], todo);
  return ref;
};
```
We create an action that adds a new todo to our projects map using a created ref. Then it returns that ref. Our next action will now save that todo.
```js
let saveTodo = function (cerebral, ref) {
  let todo = cerebral.get(['todos', ref]);
  return ajax.post('/todos', {
    title: todo.title,
    completed: todo.completed
  })
  .success(function (id) {
    return {
      ref: ref,
      id: id
    };
  });
};
```
Our action now grabs the todo using the ref and declares exactly what properties to send to the server. This has two benefits. You can see in your code exactly what you pass to the server and you avoid sending unnecessary data, like the client side $isSaving property. When the server responds with an ID we update our reference and link it to the new id. Then we return the id for the next action which will actually set the id on our todo.

```js
let setTodoId = function (cerebral, result) {
  cerebral.ref.update(result.ref, result.id);
  let todo = cerebral.get(['todos', result.ref]);
  cerebral.set([todo, 'id'], id);
};
```
We can now update the ref with the id. This allows us to do `cerebral.ref.get(todo.id)` and it returns the ref which can be used to `cerebral.get('todos', ref)`.

What we have achieved with this implementation is to remove the need for ids completely. The client, with Cerebral, is in full control of all objects and you can use both refs and ids to find what you need. This implementation becomes especially useful when mapping relational data.

An example of this would be in a mpping function to grab a user from a usersmap using the referenced  `authorId`.

```js
let cerebral = Cerebral({
  projects: {},
  users: {},
  projectRows = function () {
    return {
      initialState: [],
      lookupState: ['projects', 'users'],
      get(cerebral, lookupState, projectRefs) {

        return projectRefs.map(function (ref) {

          let project = lookupState.projects[ref].toJS();
          let userRef = lookupState.users[cerebral.ref.get(project.authorId)] || {
            $notFound: true
          };

          return project;

        });

      }
    };
  }
})
```

### toJS
```js
let todo = cerebral.get('todos', 0);
todo.title; // "foo"
todo.title = 'bar';
todo.title; // "foo"
let copy = todo.toJS();
copy.title = 'bar';
copy.title; // "bar"

cerebral.toJS(); // The whole cerebral
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

### recording
**Note!** This feature is in preview stage.

You are able to implement recording of state in Cerebral. This is done using the preset signals available when instantating cerebral.

```js
class SomeComponent extends React.Component {
  render() {
    return (
      <button onClick={this.signals.recorder.play}>Play</button>
      <button onClick={this.signals.recorder.stop}>Stop</button>
      <button onClick={this.signals.recorder.record}>Record</button>
    );
  }
}
```

You also have preset state available which indicates the state of your recording and playback.

```js
import Cerebral from 'cerebral/decorator';

@Cerebral(['recorder'])
class SomeComponent extends React.Component {
  render() {
    return (
      <button 
        disabled={!this.props.recorder.hasRecording}
        onClick={this.signals.recorder.play}>
        Play
      </button>
      <button
        disabled={this.props.recorder.isRecording && this.props.recorder.isPlaying}
        onClick={this.signals.recorder.record}>
        Record
      </button>
      <button
        disabled={!this.props.recorder.isRecording}
        onClick={this.signals.recorder.stop}>
        Stop
      </button>
    );
  }
}
```
Currently you can only **record**, **stop recording** and **play back recording**. Later versions will have possibility to stop playback, pause playback etc.

