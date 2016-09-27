---
title: Namespacing
---

## Namespacing

Structuring application logic and state is completely necessary when you get to a certain size. The question is how?

One approach is to create isolated container of state and logic. For example you create a class:

```js
class Todos {
  todos = []
  addTodo(todo) {
    this.todos.push(todo)
  }
}
```

Cerebral takes a different approach. The reason is simple. It is very difficult to visualize the state of your application, both mentally and in tools when the state are just random instantiated classes around your codebase.

By using a single model and namespacing we achieve two things:

1. Visualize all the state of your application as a single object in the debugger

2. State updates are done by pointing to a path, rather than importing different models

Generally namespacing gives you the best of both worlds. You can decouple your code the same way, but it is all connected. Allowing you to visualize and point into your app with a path. In Cerebral this is done using **modules**. It is just a namespace wrapper around state and signals.
