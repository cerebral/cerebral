# Introduction

Requirements for this tutorial is that you have [Node](https://nodejs.org/en/) version 5 or higher installed. You would definitely benefit from a fresh cup of coffee or a beer as well, ready to learn something new :)

This tutorial will take you through the core concepts of Cerebral.

## Step 1
To get started you will need to clone the cerebral Github repository. To do so you need [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed, or the [Github desktop](https://desktop.github.com/) client. Now clone the repo to a folder on your computer, either by command line:

`git clone https://github.com/cerebral/cerebral.git`

or using the desktop application.

## Step 2
Then go to directory **cerebral/docs/tutorial** and run the command:

`npm install`

## Step 3 (Alpha note)
During the alpha you also need to do the following after the install:

`npm install cerebral@next cerebral-provider-http@next cerebral-router@next --save --save-exact`

This may take a little while and does **not** mean that Cerebral is a huge download. In fact, Cerebral as a production build is very small compared to other popular frameworks.

## The features
Our Goal now is to go through some concepts and show off the features of Cerebral:

- **Controller**
- **State**
- **Signals**
- **Connect**
- **Providers**
- **Routing**

They are all explained in depth in the [In depth](../in depth) section.

## How does this tutorial work?
To start the tutorial, run:

`npm start`

This fires up the actual development server. Go to your browser and *localhost:3000*. It also provides you a list of the chapters directly in the terminal. Just change chapters there when you want to move on. The application running in the browser will update.

For beginners in web development we have the following advice: Just follow the tutorial, don't get too much distracted by advanced concepts. Learning new things takes some iterations and often it is more helpful to try to build something yourself. Please head over to our [discord chat](https://discord.gg/0kIweV4bd2bwwsvH) and we are more than happy to help you out.

## Structure and bootstrapping

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
├── DO_NOT_TOUCH
| ├── 01
| | ├── ...
| ├── 02
| | ├── ...
| ├── ...
|
├── package.json
├── ...
```
### The components - folder
Currently holds App, a React component which is responsible for the title you are seeing. There will be more components in here as we move on in the tutorial.

### The index.html - file

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

Nothing special as you can see, though you might wonder where the magic actually starts? This file is actually a template file used by [Webpack](https://webpack.js.org/), the tool the builds your application. It will automatically inject your application into this HTML file when the development server starts.

### The index.js - file

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

If you are not familiar with [JSX](https://facebook.github.io/react/docs/jsx-in-depth.md), the syntax that looks like HTML, it can be explained briefly as "some sugar over normal JavaScript". This is **not** HTML in JavaScript, it is pure JavaScript, it just allows you to define the UI with a familiar syntax. You might think this is "icky", but trust us... UIs has become a lot more complex over the years and we need the power of JavaScript to describe and manage them!

## Installing the debugger
Please install either the standalone or chrome extension debugger, following [these instructions](../install/index.html#debugger)
