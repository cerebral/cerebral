---
title: Adding modules
---

## Adding modules

It does not take long before you need to split up your state and signals. In Cerebral you can use modules to handle that. Modules are a very simple concept, they basically namespace state, signals and services to give structure. Let us see how we can define a module for our application:

[src/model.js](https://github.com/cerebral/cerebral-website-tutorial-next/blob/react/src/controller.js)


What we have done now is add a namespace to our application called **app** and we reference our App module. We also have two other modules, **devtools** and **http**. That means there is no difference creating an application specific module or a module you want to share with others. Let us take a closer look at our **App** module:

[src/modules/App/index.js](https://github.com/cerebral/cerebral-website-tutorial-next/blob/react/src/modules/App/index.js)

A module is just a function that receives the module. We can now attach our state and the signals to the module instead of directly on the controller. When we have namespaced our state we must also make sure our components points to the complete state path:

###### React

[src/components/App/index.js](https://github.com/cerebral/cerebral-website-tutorial-next/blob/react/src/components/App/index.js)

###### Snabbdom

[src/components/App/index.js](https://github.com/cerebral/cerebral-website-tutorial-next/blob/snabbdom/src/components/App/index.js)

###### Inferno

[src/components/App/index.js](https://github.com/cerebral/cerebral-website-tutorial-next/blob/inferno/src/components/App/index.js)

-----

Notice here that we have also split our component into two parts. The **App** component and the **Items** component. Though modules often has a component with the same name you should not consider them "part of the same thing". As mentioned before components are completely separated from your actual application and you should not mix these two concepts together. You will have a lot more components than modules.

With this structure in place you start to see how larger applications scale in terms of files and directories.

```javascript
/src
  /components
    /App
    /Items
  /modules
    /App
      /actions
      /chains
      index.js
  controller.js
  main.js
```

#### Best practices
Creating modules helps you decouple and structure your application. Modules are really nothing more than namespacing, but you will see later what other benefits we can also get from modules. A challenge decoupling code is isolation. In Cerebral that does not happen. Any module has access to any state in your model, also chains and actions can be reused across modules. Since components are completely decoupled from your application they have access to any state and any signal.

And yes, modules can have submodules ;-)

#### Challenge
Try changing the namespace of **app** and refactor the application to use that new namespace.

[Next](./03_creating_actions.en.md)
