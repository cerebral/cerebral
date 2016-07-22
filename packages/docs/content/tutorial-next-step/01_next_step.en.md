---
title: Next step
---

## Next step

This tutorial will take you through the second demo application of Cerebral. Now we have added a server where we want to save our added items. Asynchronous state changes, like talking to the server, is one of the more complex things we do in web applications. Again you can choose which view layer you want to use by cloning a specific branch of the demo:

###### React

`git clone -b react https://github.com/cerebral/cerebral-website-tutorial-next.git`

Or [download as ZIP](https://github.com/cerebral/cerebral-website-tutorial-next/archive/react.zip)

###### Snabbdom

`git clone -b snabbdom https://github.com/cerebral/cerebral-website-tutorial-next.git`

Or [download as ZIP](https://github.com/cerebral/cerebral-website-tutorial-next/archive/snabbdom.zip)

###### Inferno

`git clone -b inferno https://github.com/cerebral/cerebral-website-tutorial-next.git`

Or [download as ZIP](https://github.com/cerebral/cerebral-website-tutorial-next/archive/inferno.zip)

-----

### Starting the project
This project has a Node Express setup. We proxy the requests going to our Webpack development server to this Node express server. This separates the workflow of building the client and the server.

`$ npm install`

After you are done you can fire up the webpack workflow and the Node express server by using:

`$ npm run client` and `$npm run server` in a second tab

Go to *localhost:3000* in your browser and the Cerebral demo application will appear.

#### Best practices
In this section we fired up the second Cerebral demo. Normally you can use the **cerebral-cli** tool to set up a basic project with a Webpack workflow. It is quite common to have a Node server running as well, even though your actual backend is running on a completely different platform. This allows you to simulate requests and responses to the client application. You might only do this in development, but also production applications can use Node as a "middle-end", proxying requests to one or multiple backends.

[Next](./02_adding_modules.en.md)
