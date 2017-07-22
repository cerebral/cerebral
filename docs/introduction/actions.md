# Actions

An action is just a function. What makes an action different from a normal function though is that it in any situation receives only one argument, created by Cerebral. It is called the **context**. Actions are "low level" and imperative. There is no declarative code without some imperative code behind it. In Cerebral most of the imperative action code is already available to you, but sometimes you need to write custom logic. That is when you write your own action.

```js
function iAmAnAction (context) {}
```

Whatever side effect you need to run, even a state change, you do from the context. It means you do not need any API to define an action or import any other modules to define business logic. This makes actions highly testable and easy to write.

Here is an example of an action changing the state of the application:

```js
function iAmAnAction ({state}) {
  state.set('some.path', 'foo')
}
```

## Tutorial

**Before you start,** [load this BIN on Webpackbin](https://www.webpackbin.com/bins/-KdBPZwKFDQKkAcUqRte)

If you run this bin right away you will see a message popping up after clicking the button.
Now let us customize the existing **signal** by adding a custom **action** in between the sequence.

Signals can take a props-object which can then be accessed or processed by any subsequent action.

Let us say you have a user input which should get written to state.
As we now know, the correct way to write any state change is to use **signals** with **actions**.

Just like we are able to grab the **state** from the context of an action, we can also grab the **props**. This props object can be populated when a signal triggers and it can be further extended using actions. Any object returned from an action will be merged into the current props and passed to the next action.

### Create an action
Let us create a new action inside *controller.js* that will take a prop from the signal and add some exclamation marks.

```js
function shoutIt ({props}) {
  return {
    message: `${props.message}!!!`
  }
}
```

As you can see we grabbed the props just like we grabbed the state. The object we return from the action will be merged with the existing props. That means we are overriding the **message** with exclamation marks.

We also add an action for setting the toast which pulls out the message from the props.

```js
function setToast ({state, props}) {
  state.set('toast', props.message)
}
```

Then we wire those actions together in our buttonClicked-**signal**

```js
...
{
  buttonClicked: [
    shoutIt,
    setToast
  ]  
}
...
```

### Passing a payload
As you can see we are passing the message as a payload in the onClick-Handler. Feel free to change it:

*App.js*
```js
        ...
        <button onClick={() => buttonClicked({
          message: 'Please shout me'
        })}>
          Update state
        </button>
        ...
```

Now we are ready to test drive our changes. Click the button and you should see the toast message appear with three exclamation marks behind. Take some time to open up the **debugger** and explore the changes you've made. You can track the flow of the props object as it is passed into the action *props:{}* and after the action has excecuted *output: {}*. Keep in mind that the object returned from an action will be merged with the props object and handed over to the next action. You could just as easily use a different property for the shouted message.

### Challenge

- Add another custom action which transforms the props value to Uppercase. You may override existing properties on the props or create a new one

If it did not work try jumping to the next chapter or [shout at us on Discord](https://discord.gg/0kIweV4bd2bwwsvH).
