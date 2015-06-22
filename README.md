# cerebral - alpha ![build status](https://travis-ci.org/christianalfoni/cerebral.svg?branch=master)
An intelligent react application framework

<img src="images/logo.jpg" width="300" align="center">

## API
Read the **[API DOCUMENTATION](API.md)**

## Demos
**TodoMVC**: [www.christianalfoni.com/todomvc](http://www.christianalfoni.com/todomvc)

## Video introductions

- **[Get started - 4:13](http://www.youtube.com/watch?v=Mm4B5F432SQ)**. See how you get started with your Cerebral app. Using a boilerplate you have everything you need for a great workflow and even a server you can put into production.

- **[The debugger - 8:13](http://www.youtube.com/watch?v=Fo86aiBoomE)**. We take a look at the powerful debugger for Cerebral. Giving you complete overview and control of your application state flow.

- **[Building your first app - 14:24](https://www.youtube.com/watch?v=ZG1omJek6SY)**. We build the hello world application in the boilerplate using our debugger to explain a pretty awesome workflow.

- **[Creating dynamic state - 5:32](https://www.youtube.com/watch?v=Dnz0HY35tf8)**. We are going to look at where and how you create dynamic state.

- **[Caching and relational state  - 28:40](https://www.youtube.com/watch?v=6W0S2p01Paw)**. We are going to handle some really complex stuff. A table with pagination and caching in place, but also automatically request users from the servers as we load projects.

## State of Cerebral and the future
Cerebral is currently being used to implement a new type of learning platform. The platform has been developed over the last year, but with Cerebral the project has been rebuilt from scratch. Cerebral is this far performing very well and tweaks and changes will be made until the release of the platform. More information on this will be released at a later point.

## Cerebral - The abstraction
Read this article introducing Cerebral: [Cerebral developer preview](http://christianalfoni.com/articles/2015_05_18_Cerebral-developer-preview)

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
Read this article introducing Cerebral: [Cerebral developer preview](http://christianalfoni.com/articles/2015_05_18_Cerebral-developer-preview)

You can use the [cerebral-boilerplate](https://github.com/christianalfoni/cerebral-boilerplate) to quickly get up and running. It is a Webpack and Express setup.

## Remember
What makes **cerebral** truly unique is how you are able to debug it. The signals implementation gives **cerebral** full control of your state flow, even asynchronous flow. That way it is very easy to retrace your steps. By using the built in debugger you can reproduce states very easily and use the logging information to identify how state flows and what changes are made to the state.
