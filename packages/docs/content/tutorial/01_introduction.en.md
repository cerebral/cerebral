---
title: Introduction
---

## Introduction

Requirements for this tutorial is that you have [Node](https://nodejs.org/en/) version 5 or higher installed. You would definitely benefit from a fresh cup of coffee or a beer as well, ready to learn something new :)

This tutorial will take you through the core concepts of Cerebral. To get started you can [download this tutorial as a ZIP file](https://raw.githubusercontent.com/cerebral/cerebral/master/packages/tutorial/tutorial.zip).

Extract the content to a folder of your choice, go to your terminal/command line, traverse to the directory where the files are and run:

`npm install`

This may take a little while and does **not** mean that Cerebral is a huge download. In fact Cerebral as a production build is very small compared to other popular frameworks.

Our Goal now is to go through some concepts and show off the features of Cerebral:

- **Controller**
- **State**
- **Signals**
- **Actions**
- **Providers**
- **Routing**

They are all explained in depth in the [Concepts](../concepts/01_the-architecture.html) section.

### How does this tutorial work?
To start the tutorial, run:

`npm start`

This fires up the actual development server. Go to your browser and *localhost:3000*. It also provides you a list of the chapters directly in the terminal. Just change chapters there when you want to move on. The application running in the browser will update.

For beginners in web development we have the following advice: Just follow the tutorial, don't get distracted too much by advanced concepts. Learning new things takes some iterations and often it is more helpful to try to build something yourself. Please head over to our [discord chat](https://discord.gg/0kIweV4bd2bwwsvH) and we are more than happy to help you out.

### Structure and bootstrapping

```
.
├── public
|	├── index.html
|   
├── src
|	├── components
|	|	├── App
|	|	├── ...
|	|	├── ...		
|	|
|	└── index.js
|
├── parts
| ├── 01
| | ├── ...
| ├── 02
| | ├── ...
| ├── ...
|
├── package.json
├── ...
```
#### The components - folder
Currently holds App, a React component which is responsible for the title you are seeing. There will be more components in here as we move on in the tutorial.

#### The index.html - file
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="blaze.min.css">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <title>Cerebral Tutorial</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

```
Nothing special as you can see, though you might wonder where the magic actually starts? This file is actually a template file used by [Webpack](https://webpack.github.io/), the tool the builds your application. It will automatically inject your application into this HTML file when the development server starts.

#### The index.js - file
```js
import React from 'react'
import {render} from 'react-dom'
import {Controller} from 'cerebral'
import App from './components/App'
import {Container} from 'cerebral/react'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  devtools: Devtools()
})

render((
  <Container controller={controller}>
    <App/>
  </Container>
), document.querySelector('#root'))
```
This the entry point of your application and this is where we bring it all together.

1. We import the necessary dependencies for our application to run
2. We instantiate a Cerebral controller and the **Devtools** which will give us a lot of insight into our running application
3. We render the application using React by exposing the **controller** through a **Container** wrapper

If you are not familiar with [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html), the syntax that looks like HTML, it can be explained briefly as "some sugar over normal JavaScript". This is **not** html in JavaScript, it is pure JavaScript, it just allows you to define the UI with familiar syntax. You might think this is "icky", but trust us... UIs has become a lot more complex over the years and we need the power of JavaScript to describe and manage them!

### The debugger
The Cerebral debugger is a huge deal. It is an essential tool for handling complexity in your applications. You can choose to install a standalone application or the chrome extension. Take a detour to [devtools page](02_devtools.html), install it and then refresh your application before moving on.
