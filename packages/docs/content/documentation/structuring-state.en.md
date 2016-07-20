## Structuring state

In a Cerebral application all the state of your application exists in the a model we call "the state tree". This concept helps you create a mental image of all the state in your application, it being a list of users or what page is currently active.

We also get some other benefits with this approach. Things like visualizing the state of our application in a debugger and the actual state changes. Even how state changes affects the rendering of the application can be visualized. If you use the immutable model it also makes it very easy to hydrate/dehydrate all the state of the app, record changes and even time travel debugging as well.

In the demo project we have already defined some state using one of the two model packages for Cerebral:

[src/model.js](https://github.com/cerebral/cerebral-website-tutorial-basic/blob/react/src/model.js)

Our application should just show a list of items and allow us to add new items with a title. Thinking about what state your application needs before you implement logic and UI is a very good exercise that can be done with multiple developers. Basically you describe what state is needed to produce the UI you want to build for your users.

### Namespaces
Typically you create namespaces for your state to structure it. In an application with multiple pages you might namespace by page:

```javascript
const model = Model({
  home: {},
  feed: {},
  issues: {},
  admin: {}
})
```

But there are no limits to this. You structure your state in a way that makes sense to you and your team.

Cerebral has a concept of **modules** which helps you do this namespacing for your state and your signals. We will look more at this later.

#### Best practices
It can often be a good idea to start any implementation by defining state structure. If you think of a design mock of a user interface you can translate this into state of strings, numbers, booleans, objects and arrays. It is a good team exercise that ensures the conventions on naming state properties and overall structure is aligned.

#### Challenge
Try to add a new state called **title** with some text. Then try to display that in the component.
