## Signals and actions

Signals can be seen as events - a user clicks, the address bar changes, a web socket pushes data and so on. Each signal you define will trigger exactly one signal chain. A signal chain allows you to express complex flows (business logic) without thinking about implementation. This is much like we think about complexity in real life. We label things that needs to be done without thinking about the details. These labels are called actions in Cerebral and they are the building blocks of action chains. We will talk more about these actions, but for now just think of them as labels for what should be done.

In the demo application there are already two signals defined. Lets have a look:

[src/controller.js](https://github.com/cerebral/cerebral-website-tutorial-basic/blob/react/src/controller.js)

As you can see we are defining the name of these signals in past tense **newItemTitleChanged** and **newItemTitleSubmitted**. Each signal is then mapped to an action chain **updateItemTitle** and **addNewItem** which expresses what is going to happen after the signal occurred.

This gives a couple of advantages:

* Your UI stays dumb. Meaning that the UI has no knowledge of what will happen when the signal triggers, it just tells your application what is happening in the UI
* When you refactor your action chains, you won't have to change any the the signal references.

You also see that we define the two signals differently. The reason is that by default Cerebral will trigger a signals action chain after the next animation frame of the browser. That ensures that your business logic and a new render of your application happens at the optimal time. But when we update the state of inputs and textareas we have to do that *synchronously*, or immediately as we call it in Cerebral world. So our **newItemTitleChanged** signal runs immediately, but **newItemTitleSubmitted** runs right after the next animation frame.

Let us now have a look at the chain we used to define the **newItemTitleSubmitted** signal:

[src/chains/updateItemTitle.js](https://github.com/cerebral/cerebral-website-tutorial-basic/blob/react/src/chains/updateItemTitle.js)

A chain is an array. An array that describes how the actions should be executed. In this chain we are copying the title from the signal input over to the path **newItemTitle** in our model. We use a Cerebral operator to do so. This is the most straight forward state change you can do. Your UI has passed in a payload to the signal which becomes available on the input and we copy it into our model.

#### Best practices
Signals execute the *state changing flow* of your application using chains. Signals and action chains are at the core of Cerebral and make it possible for you and your team members to quickly understand how state changes run in your application. These chains can become very complex, but they are still easy to read and understand. As you work on larger applications you will use concepts like composition and factories to create these chains.

#### Challenge
Create a button that uses the same **newItemTitleSubmitted** on the click to add a new item to the list, as an alternative to hitting enter.
