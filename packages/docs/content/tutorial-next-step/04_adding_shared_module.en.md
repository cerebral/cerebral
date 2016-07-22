---
title: Adding a shared module
---

## Adding a shared module
Cerebral has an ecosystem of modules and providers. It is easy to extend the functionality of Cerebral by using these concepts and we highly encourage to share what you build. One module is called **cerebral-module-http**. It is based on the [axios](https://github.com/mzabriskie/axios) library and gives you a service that can talk to your server.

The demo application already has this module installed and you can see it instantiated with the **App** and **Devtools** module.

[src/controller.js](https://github.com/cerebral/cerebral-website-tutorial-next/blob/react/src/controller.js)

You might have noticed that we actually call both **Http** and **Devtools** as a function. The reason is that most shared modules allows you to pass in some options. The options you optionally pass into the instantiation of **Http** are just passed straight into Axios, meaning that you get a lot of features out of the box. The demo application puts the http module on the namespace **http**, but you can choose whatever namespace you want.

### Using a service
The http module exposes services that allows us to talk to the server. One of those services is called **post** and you find it on the namespace *http* under *services*, as that is the namespace we chose for it.

[src/modules/App/actions/postItem.js](https://github.com/cerebral/cerebral-website-tutorial-next/blob/react/src/modules/App/actions/postItem.js)

As you can see our service returns a promise where we call an **output.success** function when it is successful and **output.error** if something goes wrong. The action also has two properties added to it. The **async** property tells Cerebral that this action runs asynchronously. The **outputs** property defines what outputs this action should have and also allows Cerebral to statically analyze the execution of the signal to verify that it defined correctly.

#### Best practices
When you depend on some library it is quite common to create a module that exposes services wrapping what you need from that library. By doing that it is also very easy to share that module with other Cerebral developers. Wrapping other libraries with Cerebral is of course not necessary, but it will help with your mental image of changes in your app because the debugger will now know about these services and when they are called.

[Next](../tutorial-advanced/01_advanced.en.md)
