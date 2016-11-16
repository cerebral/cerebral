---
title: ch07. Paths
---

## Paths

[Preview](07)

Run script from the command line to start:
`npm run start:ch 07`

In the previous chapter we introduced async actions. But what about the following scenario: "User gets data async from a server, server responds with either a success or error". To handle not only the so called *Happy Path* we should also allow our signals to branch out into a different flows (which is just another chain of actions and operators) depending on the result of the previous action.

So let us build that scenario introducing *cerebral-http-provider*. *cerebral-http-provider* is a simple http-provider which enables you to request data from servers. We have already added it as a configuration of the controller. The concept of **Providers** will be covered in more detail in the next chapter.

To handle any kind of diverging execution in a signal we can use the concept of **paths**. A simple signal using paths and a sample async action named *getData* could look like this:

```js
{
  submitClicked:[
    getData, {
      success:[
        processResults,
        showSuccessMessage
      ],
      error: [showErrorMessage]
    }
  ]
}
```

Where *success* and *error* are our **paths**.

Let us implement something similar. We are going to grab information about github repos and display it in the toast:

```js
...
import {set, state, wait, input, string} from 'cerebral/operators'
...
{
  buttonClicked: [
     ...showToast(string`Loading data for repo: ${input`repo`}`, 2000),
     getRepo, {
       success: [
          ...showToast(string`How cool is that. ${input`repo`} has ${input`data.subscribers_count`} subscribers and ${input`data.stargazers_count`} stars!`, 5000, 'success')
       ],
       error: [
         ...showToast(string`Ooops something went wrong: ${input`data.message`}`, 5000, 'error')]
      }
  ]
}
```

As you can see you can configure as many and whatever paths you like. Just add an object after an action and the action will know about possible paths to execute.

The **getRepo** action can look like this:

```js
...
function getRepo({input, http, path}) {
  return http.get(`/repos/cerebral/${input.repo}`)
    .then(response => path.success({data: response.result}))
    .catch(error => path.error({data: error.result}))
}

const controller = Controller(...)
```

The path **success** and **error** are now available inside the action because we defined those paths after the action in the chain. Last, but not least, we need to pass in a **repo** property on our button click:

*src/components/App/index.js*
```js
...
<button
  className="c-button c-button--info c-button--block"
  onClick={() => props.buttonClicked({
    repo: 'cerebral'
  })}
>
...
```

But there is an issue here. Did you notice that the message *Loading data for repo...* is blocking the execution for 2 seconds? It would be nice to indicate to Cerebral that actions can execute in parallel. Relax and take a sip from your coffee or beer, Cerebral has you covered!

Replace your signal with the following snippet:

```js
{
  buttonClicked: [
    [
      ...showToast(string`Loading data for repo: ${input`repo`}`, 2000),
      getRepo, {
        success: [
           ...showToast(string`How cool is that. ${input`repo`} has ${input`data.subscribers_count`} subscribers and ${input`data.stargazers_count`} stars!`, 5000, 'success')
        ],
        error: [
          ...showToast(string`Ooops something went wrong: ${input`data.message`}`, 5000, 'error')]
       }  
    ]
  ]
}
```

What is happening here? Did you spot the additional **[** and **]**? Well whenever Cerebral encounters an Array in a Array  **[action1,[action2,action3],action4]** it will start the actions within that array in parallel, so after action1 finishes action2 and action3 are executed right after each other, even though they run asynchronously. After action2 and action3 finish, action4 will be executed.

We got even more flow control now, telling Cerebral to execute actions/operators in parallel by using JS arrays, and objects to diverge execution. By reading the signals you get a good understanding what the application will do. And don't forget, you do not even have to look at code to understand this, the debugger reflects parallel execution, state changes and even **paths** chosen.

But... there is an issue here. Did you notice that these **showToast** action factories does not cancel each other out? So the initial 2 second wait might close the toast where it was supposed to hold for 5 seconds after a success? There is a way to fix this.

Instead of using **wait**, we can use **debounce**. It is difficult to wrap your head around debounce. By itself it ensures that whenever we run **showToast**, any pending toast timer will be discarded. But that is not enough, cause we have multiple *showToast* in our signal. So we need this behaviour to be shared across them. Whenever any *showToast* is called, we want the existing pending toast timer to be discarded. This just ensures whenever we display a toast it will stay there for the time set, unless a new toast is triggered.

```js
...
import { set, state, debounce, input, string } from 'cerebral/operators'
...
const toastDebounce = debounce.shared()
function showToast(message, ms, type = null) {
  return [
    set(state`toast`, {type}),
    set(state`toast.message`, message),
    ...toastDebounce(ms, [
      set(state`toast.`, null)
    ])
  ]
}
...
{
  buttonClicked: [
    ...showToast(string`Loading data for repo: ${input`repo`}`, 2000),
    getRepo, {
      success: [
      ...showToast(string`How cool is that. ${input`repo`} has ${input`data.subscribers_count`} subscribers and ${input`data.stargazers_count`} stars!`, 5000, 'success')
      ],
      error: [
        ...showToast(string`Ooops something went wrong: ${input`data.message`}`, 5000, 'error')]
    }
  ]
}
```

Congratulations! Now you know how to control your flow using **paths**. And if you need **parallel actions/operators**, well just add another array **[]** to the chain. You have even gotten insight into very complex control flow using **debounce**.

### Challenge

We would like you to run two getRepo(...) requests. One to *cerebral/cerebral* and one to *cerebral/addressbar*. So it is a good idea to make *getRepo* a factory instead. On their successes they should insert their data into the state tree. Also create an action that sums the stars and adds a third state in the state tree with the sum of both repos star count. This part requires you to read up on how to set and get state in actions. This sum action should run and be displayed in a toast after both *getRepo* are done running. Remove any other success and error toasts.
