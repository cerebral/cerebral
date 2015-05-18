# cerebral - alpha ![build status](https://travis-ci.org/christianalfoni/cerebral.svg?branch=master)
An intelligent react application framework

<img src="images/logo.jpg" width="300" align="center">

| [API](API.md) |

## Video introductions

- **[Get started - 4:13](http://www.youtube.com/watch?v=Mm4B5F432SQ)**. See how you get started with your Cerebral app. Using a boilerplate you have everything you need for a great workflow and even a server you can put into production.
- **[The debugger - 8:13](http://www.youtube.com/watch?v=Fo86aiBoomE)**. We take a look at the powerful debugger for Cerebral. Giving you complete overview and control of your application state flow.
- **[Building your first app - 14:24](https://www.youtube.com/watch?v=ZG1omJek6SY)**. We build the hello world application in the boilerplate using our debugger to explain a pretty awesome workflow.
- **[Complex relational state - 37:17](http://www.youtube.com/watch?v=xx7Y2MkYgUA)**. We are going to implement some of the more complex state handling. Relational data with two different endpoints and caching.

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
