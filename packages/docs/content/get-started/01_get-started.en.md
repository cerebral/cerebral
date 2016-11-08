---
title: Get started
---

## 1: Get started

If you want to install Cerebral into an existing project please...

`npm install cerebral`

...and then move on to the other docs.

If you want an introduction you can keep reading and go through a small demo project. Just make sure you fulfill these requirements:

* You have installed [Node](https://nodejs.org/en/) version 4 or later
* You have installed [Git](https://git-scm.com/)
* You are okay with learning Cerebral using React and JSX. You can choose a different Viewlayer (like [Inferno](http://infernojs.org//)) for your own project later though. 
* You have a coffee or a beer, ready to learn something new


### Installing the project

Okay, lets get going. First you need to clone cerebral repo. So fire up your command line go to your drive and directory of choice and do:

`git clone https://github.com/cerebral/cerebral.git`

then do a  `cd cerebral/packages/cerebral-website-tutorial`

followed by  `npm install`

This may take a little while and does **not** mean that cerebral is a huge download. In fact cerebral as a production build is very small compared to other popular frameworks and therefore has fast loading times. The tutorial runs on [react-create-app](https://facebook.github.io/react/blog/2016/07/22/create-apps-with-no-configuration.html) by Facebook.
After npm did its job you can fire up the project with:

`npm start`

Go to *localhost:3000* and you should see a blue button with some text in it.
So yeah, congratulations you have mastered the first step in the tutorial.
Our Goal now is to build up a very simple demo app showing off key features of Cerebral:

- **Controller**
- **State**
- **Signals**
- **Actions**
- **Providers**
- **Routing**

They are all explained in depth in the [Concepts](../concepts/01_the-architecture.html) - Section.

### How does this tutorial work?
If you check out the *./parts/ - folder* you'll see all the code for every chapter we will build up during this tutorial. We have added a few scripts that will help you to deal with this code. So first of all go ahead and run ```npm run ch16``` in your console. It will load all the files from the last chapter and start the development server.
So you are right now looking at the endresult of this tutorial :)
So running those scripts will overwrite your root *./src* and *./public* folders.That also means if you did some cool sidesteps or adjustments **you should save them before**.
Since this is now Chapter 1 (as indicated in the title) we need to **init** this tutorial. Please execute `npm run ch01` in the console to get there.
Whenever you see a `npm run chxy` in the following chapters, just execute this script and we will be in sync.
If you just need to restart the development server use `npm run start` so you won't loose your changes!

For beginners in webdevelopment we have the following advice: Just follow the tutorial, don't get distracted too much by advanced concepts. So just go ahead if you encounter some advanced concepts, finish the tutorial and then read the other topics you can find on this page. You will have some enlightening moments then. Btw. what really helps to catch a lot of errors is a good linter. We recommend to use [Standard](http://standardjs.com/).


### Structure and bootstrapping

```
.
├── public
|	├── index.html
|   
├── src
|	├── components
|	|	├── HeaderButton
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
Currently holds a stateless HeaderButton - React Component which is responsible for the blue button you are seeing. 
There will be more components in here as we move on in the tutorial. Btw. we really encourage people to use stateless components (that is a react/inferno thingy). By just making them stateless and dependent on cerebral-state apps turn out to be much more predictable.

#### The index.html - file
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="blaze.min.css">
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    <title>Cerebral Chapter 01</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

```
Nothing special as you can see. But where does the magic start? Well first of all, there is not too much magic when working with Cerebral. That means you will always feel in control when working with Cerebral. The connection between the View and Cerebral will be more obvious when checking out *src/index.js*

#### The index.js - file
```js
import React from 'react'
import { render } from 'react-dom'
import { Controller } from 'cerebral'
import HeaderButton from './components/HeaderButton'
import { Container } from 'cerebral/react'
import Devtools from 'cerebral/devtools'

const controller = Controller({
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools()
})

render((
  <Container controller={ controller }>
    <HeaderButton/>
  </Container>
  ), document.querySelector('#root'))
```
Here all the goodness comes together. The Viewengine, the **Controller** and a **Container**. The HeaderButton-ViewComponent gets placed inside the **Container** which holds it all together and exposes the **Controller** to React. The **Container** itself gets placed inside the DOM into the element with the **id #root**, hence our link to the *index.html*.
Well but what is this Devtools - Thingy good for?
Prepare to enter the world of the **cerebral debugger**

### Installing the debugger
The Cerebral debugger is a Chrome extension. You can install it from the [chrome store](https://chrome.google.com/webstore/detail/cerebral-debugger/ddefoknoniaeoikpgneklcbjlipfedbb). Once the debugger is installed your Chrome devtools will have a new tab called **cerebral2**. Open it.
Not a lot to see right now. Well let us change that and add so called **State** to our application.

