# Paths

**Load up chapter 07** - [Preview](07)

In the previous chapter we introduced async actions. But what about the following scenario: "User gets data async from a server, server responds with either a success or error". To handle not only the so called *Happy Path* we should also allow our signals to branch out into a different flows (which is just another chain of actions and operators) depending on the result of the previous action.

## Http Provider
So let us build that scenario introducing *cerebral-http-provider*. *cerebral-http-provider* is a simple http-provider which enables you to request data from servers. You could have used any other HTTP library if you wanted to. We have already added it as a configuration of the controller. The concept of **Providers** will be covered in more detail in the next chapter.

To handle any kind of diverging execution in a signal we can use the concept of **paths**. A simple signal using paths and a sample async action named *getData* could look like this:

```js
Controller({
  signals: {
    submitClicked:[
      getData, {
        success:[
          processResults,
          showSuccessMessage
        ],
        error: [
          showErrorMessage
        ]
      }
    ]
  }
})
```

Where *success* and *error* are our **paths**.

## Grabbing a repo
Let us implement something similar. We are going to grab information about github repos and display it in the toast:

```js
...
import {set, wait} from 'cerebral/operators'
import {state, input, string} from 'cerebral/tags'
...
{
  buttonClicked: [
    ...showToast(string`Loading data for repo: ${input`repo`}`, 2000),
    getRepo, {
      success: [
        ...showToast(
          string`
            How cool is that. ${input`repo`}
            has ${input`data.subscribers_count`}
            subscribers and ${input`data.stargazers_count`}
            stars!
          `, 5000)
      ],
      error: [
        ...showToast(
          string`
            Ooops something went wrong: ${input`data.message`}
          `, 5000)
      ]
    }
  ]
}
```

As you can see you can configure as many and whatever paths you like. Just add an object after an action and the action will know about possible paths to execute.

Also notice here that we plan our signal before implementing. Typically working in a team you would actually define the signal first and later implement the actions. It is the flow that is important to get right.

The **getRepo** action can look like this:

```js
...
function getRepo({input, http, path}) {
  return http.get(`/repos/cerebral/${input.repo}`)
    .then((response) => {
      return path.success({data: response.result})
    })
    .catch((error) => {
      return path.error({data: error.result})
    })
}

const controller = Controller(...)
```

The path **success** and **error** are now available inside the action because we defined those paths after the action in the chain. Last, but not least, we need to pass in a **repo** property on our button click:

*src/components/App/index.js*
```js
...
<button
  className="c-button c-button--info c-button--block"
  onClick={() => {
    props.buttonClicked({repo: 'cerebral'})
  }}
>
...
```

## Parallel execution
But there is an issue here. Did you notice that the message *Loading data for repo...* is blocking the execution for 2 seconds? It would be nice to indicate to Cerebral that actions can execute in parallel. Relax and take a sip from your coffee or beer, Cerebral has you covered!

Replace your signal with the following snippet:

```js
{
  buttonClicked: [
    [
      ...showToast(string`Loading data for repo: ${input`repo`}`, 2000),
      getRepo, {
        success: [
           ...showToast(
             string`
               How cool is that. ${input`repo`}
               has ${input`data.subscribers_count`}
               subscribers and ${input`data.stargazers_count`}
               stars!
             `, 5000, 'success')
        ],
        error: [
          ...showToast(
            string`
              Ooops something went wrong: ${input`data.message`}
            `, 5000, 'error')
        ]
     }
    ]
  ]
}
```

What is happening here? Did you spot the additional **[** and **]**? Well whenever Cerebral encounters an Array in an Array  **[action1, [action2, action3], action4]** it will start the actions within that array in parallel, so after action1 finishes action2 and action3 are executed right after each other, even though they return promises. After action2 and action3 finish, action4 will be executed.

We got, even more, flow control now, telling Cerebral to execute actions/operators in parallel by using JS arrays, and objects to diverge execution. By reading the signals you get a good understanding what the application will do. And don't forget, you do not even have to look at the code to understand this, the debugger reflects parallel execution, state changes, and even **paths** chosen.

## Handling time
But... there is an other issue here. Did you notice that these **showToast** action factories do not cancel each other out? So the initial 2 second wait might close the toast where it was supposed to hold for 5 seconds after a success?

Instead of using **wait**, we can use **debounce**. It is difficult to wrap your head around debounce. Simply said it ensures that whenever we run **showToast**, any pending toast timer will be discarded. But that is not enough, cause we have multiple *showToast* in our signal. So we need this behavior to be shared across them. Whenever any *showToast* is called, we want the existing pending toast timer to be discarded. This just ensures whenever we display a toast it will stay there for the time set unless a new toast is triggered.

```js
...
import {set, merge, debounce} from 'cerebral/operators'
import {state, input, string} from 'cerebral/tags'
...
const toastDebounce = debounce.shared()
function showToast (message, ms, type = null) {
  return [
    // We use merge as it supports evaluating tags in an object
    merge(state`app.toast.message`, {type, message}),
    toastDebounce(ms), {
      continue: [
        set(state`app.toast`, null)
      ],
      discard: []
    }
  ]
}
...
```

Congratulations! Now you know how to control your flow using **paths**. And if you need **parallel actions/operators**, well just add another array **[]** to the chain. You have even gotten insight into very complex control flow using **debounce**.

## Challenge

We would like you to run two getRepo(...) requests. One to *cerebral/cerebral* and one to *cerebral/addressbar*. So it is a good idea to make *getRepo* a factory instead. On their successes, they should insert their data into the state tree.

**Want to dive deeper?** - [Go in depth](../in_depth/chains_and_paths.md), or move on with the tutorial
