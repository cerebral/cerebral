## Creating components

In the demo project there is already a component defined. Let us look at how we would define the component in the different view packages.

###### React

[src/components/App/index.js](https://github.com/cerebral/cerebral-website-tutorial-basic/blob/react/src/components/App/index.js)

###### Snabbdom

[src/components/App/index.js](https://github.com/cerebral/cerebral-website-tutorial-basic/blob/snabbdom/src/components/App/index.js)

###### Inferno

[src/components/App/index.js](https://github.com/cerebral/cerebral-website-tutorial-basic/blob/inferno/src/components/App/index.js)

------

What to take notice of here is how dumb this component is. It only knows what state it is interested in and it triggers signals representing what happened in your application. That, in addition to UI description, is ideally all the responsibility your view should have.

### Decoupling app and UI
What you will quickly notice in a Cerebral application is how easy it is to move components around. Since all of them define their own state dependencies you can just move them wherever you want and they will still work.

You might be familiar with state containers and presentation containers, or the like, but that is not how Cerebral works. In Cerebral you are encouraged to define the state dependencies as close as possible to the component that needs them, not pass state down as properties to nested components. This makes it a lot easier to reason about your application.

### Rendering the application
The components of your view layer needs to know about Cerebral. This has different approaches based on the view package you decide upon, but the basic idea is the same. Expose Cerebral state and signals to the components.

###### React

[src/main.js](https://github.com/cerebral/cerebral-website-tutorial-basic/blob/react/src/main.js)

###### Snabbdom

[src/main.js](https://github.com/cerebral/cerebral-website-tutorial-basic/blob/snabbdom/src/main.js)

###### Inferno

[src/main.js](https://github.com/cerebral/cerebral-website-tutorial-basic/blob/inferno/src/main.js)

------

#### Best practices
Choosing a view package is all about familiarity. When it comes to render speed there is no perceived difference for typical apps. You should rather focus on something that makes sense for the team and that has a good ecosystem for sharing components.

Make your components as dumb as possible. They should only define state dependencies and render UI. There will always be exceptions, but stick with this and you will be able to scale your application without any issues.

#### Challenge
Create a new component called **Items** and move the UI description into that, also moving the state dependency path for the items. Make sure you import the component into App and make it a child.
