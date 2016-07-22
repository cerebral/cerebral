---
title: Creating actions
---

## Creating actions

Signals in Cerebral executes actions. Actions are just a function that receives a context:

```javascript
function myAction(context) { ... }
```

This context is created by Cerebral using its **context providers**. There are several kinds of context providers and you can also create your own. By default Cerebral will create four properties on this context:

```javascript
function myAction({input, state, output, services}) {

}
```

- **input** represents the initial payload (object) passed into the signal. Any outputs from an action will be merged and passed as input to the next action
- **state** has methods for changing and getting the state of your application
- **output** can pass a payload (object) that will be merged with the current input, allowing the next action(s) to use it. Asynchronous actions requires you to call an output to move on to the next action
- **services** allows you to do side effects like HTTP and other things. Use of services is also tracked and presented by the debugger

### Changing state
In the demo application we are using an operator to copy the **title** value from the input into our model:

[src/modules/App/chains/changeNewItemTitle.js](https://github.com/cerebral/cerebral-website-tutorial-next/blob/react/src/modules/App/chains/changeNewItemTitle.js)


Cerebral includes some helpers to change the state of your application directly in a chain. These helpers are called **operators** and **copy** is one of these operators. We use the concept of a factory, a function that returns a function, to dynamically create an action. In this case we create an action that puts a value from the input into our model. You can also create these "action factories", but let us first look at an example of a normal action:

[src/modules/App/actions/addItem.js](https://github.com/cerebral/cerebral-website-tutorial-next/blob/react/src/modules/App/actions/addItem.js)

Here we are using the **state** API of Cerebral to put our a new item at the top of our items list. Since our title is already in the model we can just grab that. To use this action simply reference it in a chain, like we do here:

[src/modules/App/chains/submitNewItemTitle.js](https://github.com/cerebral/cerebral-website-tutorial-next/blob/react/src/modules/App/chains/submitNewItemTitle.js)

Adding an item to our list and save it to the server might seem like a simple thing to do, but as you can see there are quite a bit happening. And this is not Cerebral complexity, this is application complexity. What we want is:

1. Optimistically add our item to the list
2. Reset the title in our new item input
3. Disable the input by setting our application in a saving state
4. Post item to the server
5. If the server returns success we want to merge an ID into our optimistically added item
6. If the server returns an error we want to remove our optimistically added item
7. No matter what the server returns, we want to put our application back from saving state, which enables the input again

As you can see this way of thinking is very much reflected in the chain above. That is why we often say that signals executes a decision tree, or a behaviour tree. It works very much like we think. This makes it easier to create a mental image of how these complex flows run.

#### Best practices
You have now gotten insight into how you can define your actions from scratch. When developing applications you will depend heavily on the **operators** to avoid creating new actions for every little state change. You will also start to create your own action factories and even chain factories to be reused in different signals. You will be surprised how quickly Cerebral becomes more like describing behaviour with legoblocks, rather than implementing logic.

Since chains are declarative, meaning that they do not have implementation logic, it is possible to describe them without thinking implementation. With your team or colleague you can talk about what should happen in your application when a signal triggers. Sometimes you can use **operators** to describe it, other times you just name an action that you will implement later. But most importantly a chain description will make it very easy for "the next developer", that also being you, to build a mental image of what is going on.

#### Challenge
Give new items an **$isNew** property which defaults to a true value. Use the operator **delay** in the **success** path and change the **$isNew** property of the first item in the list to *false* after 10 seconds. Then use this property in the UI to indicate when the item is new. Note that **delay** means that the signal will hold, so you will probably need to figure out where the *isSaving* should run.

[Next](./04_adding_shared_module.en.md)
