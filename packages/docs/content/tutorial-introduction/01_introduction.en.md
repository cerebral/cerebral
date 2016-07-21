---
title: Introduction
---

## Introduction

Make sure you fulfill these requirements:

* You have installed Node version 4 or later
* You are comfortable with the new ES2015 syntax
* You have a coffee or a beer, ready to learn something new

This tutorial will take you through the first demo application of Cerebral. It is a simple application that adds items to a list. If you want to look through the source code and run the project with the debugger you can clone a repo based on your view layer of choice.

###### React

`git clone -b react https://github.com/cerebral/cerebral-website-tutorial-basic.git`

Or [download as ZIP](https://github.com/cerebral/cerebral-website-tutorial-basic/archive/react.zip)

###### Snabbdom

`git clone -b snabbdom https://github.com/cerebral/cerebral-website-tutorial-basic.git`

Or [download as ZIP](https://github.com/cerebral/cerebral-website-tutorial-basic/archive/snabbdom.zip)

###### Inferno

`git clone -b inferno https://github.com/cerebral/cerebral-website-tutorial-basic.git`

Or [download as ZIP](https://github.com/cerebral/cerebral-website-tutorial-basic/archive/inferno.zip)

-----

### Starting the project
You have to install the dependencies of the project first:

`$ npm install`

After you are done you can fire up the webpack dev server using:

`$ npm start`

Go to *localhost:3000* in your browser and the Cerebral demo application will appear.

### Installing the debugger
The Cerebral debugger is a Chrome extension. You can install it from the [chrome store](https://chrome.google.com/webstore/detail/cerebral-debugger/ddefoknoniaeoikpgneklcbjlipfedbb). Once the debugger is installed your Chrome devtools will have a new tab called **cerebral**. Go to the demo app an refresh to start the debugger.

Have a look around in the debugger and play around with the demo application to see what is going on inside before moving on.

#### Best practices
In this section we fired up the Cerebral demo. Normally you can use the **cerebral-cli** tool to set up a basic project with Webpack. You can choose to run a webpack development server or use a Node express server to serve your application. The CLI will also help you build and prepare your application for production. Using the **cerebral-cli** is considered a best practice to get a project going, but you are of course completely free to do whatever you want from that point. The rest of the tutorials are custom projects, to read more about CLI go to "Get Started" section.

[Next](./02_structuring_state.en.md)
