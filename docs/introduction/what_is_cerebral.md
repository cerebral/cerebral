# What is Cerebral?

```marksy
<Logo />
```

> **Cerebral** is a JavaScript framework that helps you create complex, scalable and maintainable applications on any platform

## Complex state
The first ingredient of an application is state. At the end of the day state is just a bunch of numbers, booleans, strings, arrays and objects. The biggest problems with state are: "how to define it", "where to store it" and "how to change it". State specific solutions like [Redux](http://redux.js.org/docs/introduction/) and [Mobx](https://mobx.js.org/) are examples of popular solutions to this problem space.

## Complex UI
The second ingredient of developing an application is the UI and there is no doubt that managing UIs is complex. Writing UI in plain HTML or JavaScript just does not cut it anymore. Even older templating systems are not performant and maintainable enough for the complexity of todays applications. Luckily a lot of innovation has happened and solutions like [React](https://facebook.github.io/react/) allows us to build pieces of UI and compose it together in a very performant and maintainable way.

## Complex business logic
The third ingredient of building applications is expressing business logic. Very typically in frameworks expressing business logic is done with plain methods. You call a method and off you go. Solutions like [RxJS](http://reactivex.io/rxjs/) can help you handle very complex asynchronous logic, but having a framework that gives you an opinionated and strict way of managing asynchronous code, side effects and general business logic is less common.

> **Cerebral** helps you handle the complexity of each of these ingredients in an opinionated yet simple way
