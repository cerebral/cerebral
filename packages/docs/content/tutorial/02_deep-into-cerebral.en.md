---
title: Dive into Cerebral
---

## Dive into Cerebral

Hello and welcome to Dive into Cerebral tutorial.

Make sure that you have already followed [prerequisites](./01_prerequisites.en.md).

### Define State

[Preview](01)

Run script from the command line to start:
`npm run start:ch 01`

All interactive user interfaces needs **state** in one way or another. Cerebral stores this state in something we call a **state tree**. The state tree is the description of the state your application is in. Since Cerebral uses a state tree the debugger can visualize the whole state description of the application. Normally the state of your application is hidden and decoupled deep within the code, but with Cerebral you can read it right off the debugger.

To define the initial state of the application all we need to do is to is add it to our **Controller** in *src/index.js*

```js
...
const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!'
  }
})
...
```

Thats it! The application should automatically reload and you will see this state in the Chrome debugger.

### Render state

[Preview](02)

Run script from the command line to start:
`npm run start:ch 02`

Now lets get that state displayed in our application.
First of all we need to tell our component (App) to **connect** to the state.

So please change the *src/components/App/index.js* to:

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  title: 'title'
},
  function App (props) {
    return (
      <div className="o-container o-container--medium">
        <h1>{props.title}</h1>
      </div>
    )
  }
)
```

And voilà, your application should now display the title state. And this is the essence of creating web applications. We define state and how that state should be displayed in the user interface.

But our application does not do much. We have to introduce the concept of change. With the debugger we can actually force a change to our state and make the UI update. Click the title state in the Chrome debugger, change it and hit enter. You will see the application display your changed state.

Thanks to
```js
connect({
  title: 'title'
}, ...)
```
we told Cerebral that this component is interested in the value on the path **title**, and we wanted it exposed as **title** to our component as well. Because this component now depends on the **title** state it gets rendered whenever the path has a change.

Congratulations, you have now created application state and exposed it to a component. You have now gained the power of translating the state of the application into something a user can understand. You will notice with Cerebral that this is a very clear separation. You define your application state in Cerebral and you use components to translate this state into a user interface.

#### Challenge

It's time for your first challenge!

- Add another state to the store called *subTitle*
- Connect *subTitle* to the App component and display it in a *H3* element

### Update state

[Preview](03)

Run script from the command line to start:
`npm run start:ch 03`

Defining state and user interfaces is more about describing how something should look, rather than how it should update. Updates are the tricky part, this is where we usually introduce complexity in our applications.

Cerebral allows you to describe updates the same way you describe state and user interfaces, in a declarative manner. We call them **signals** and they will help you handle complexity both in code and in your head, trying to reason about how your application works.

Let us add a signal to our Controller in **src/index.js**:

```js
import {state, set} from 'cerebral/operators'
...
...
...
const controller = Controller({
  devtools: Devtools(),
  state: {
    title: 'Hello from Cerebral!',
    subTitle: 'Working on my state management'
  },
  signals: {
    buttonClicked: [
      set(state`subTitle`, 'Updating some state')
    ]
  }
})
```
We now defined a signal named **buttonClicked**. The signal tells us "what happened to make this signal run". A signal is defined using a **chain**, which is basically an **array of actions**. What we want to happen when this signal triggers is to update the **subTitle** in our state with a static value. That is why we use **set**, a Cerebral operator. Calling set will create an action for us that will put the value *Updating some state* on the state path *subTitle*. If you are unfamiliar with [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) in JavaScript, you should read about them.

Please take a closer look at *./src/components/App/index.js*:

```js
...
connect({
  title: 'title',
  subTitle: 'subTitle'
},
  ...
)
```
As you can see the App-Component depends on **subTitle**. That means it will render automatically whenever **subTitle** changes. Because we use the *set* operator to change the state at *subTitle*, Cerebral just knows which components need to update and thus there is no dirty checking or other value comparison needed.

To trigger the signal we need to wire up a click-handler on a button and add our signal **buttonClicked** to the **connect(..)** method (*./src/components/App/index.js*):

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  title: 'title',
  subTitle: 'subTitle'
}, {
  buttonClicked: 'buttonClicked'
},
  function App (props) {
    return (
      <div className="o-container o-container--medium">
        <h1>{props.title}</h1>
        <h3>{props.subTitle}</h3>
        <button
          className="c-button c-button--info c-button--block"
          onClick={() => props.buttonClicked()}
        >
          Update state
        </button>
      </div>
    )
  }
)
```
Now click it and take a look at the debugger. You will see the debugger list the execution of the signal, with information about what happened. This is also a tool the Cerebral debugger provides to give you insight into your application. Very handy for example when you need to dig into a **complex application** after not touching it for a long time, introduce a new team member to the application or debug complex execution flows.

So now changing the *subTitle* is kind of a silly state change on a button click. Let's introduce a very simple "Toast"-Component which will display our **buttonClicked** output.

### Chains

[Preview](04)

Run script from the command line to start:
`npm run start:ch 04`

A signal can trigger a chain of actions. For now we have seen it trigger the **set**-action. In this chapter we have added a **Toast** component which displays any message set on its related state.

Let us add another operator named **wait** and another **set** to close our toast message after a few seconds. So go ahead and change our **buttonClicked** signal in *src/index.js* to execute a 2 more actions:
```js
...
import {set, state, wait} from 'cerebral/operators'
...
{
  buttonClicked: [
    set(state`toast`, 'Button Clicked!'),
    ...wait(4000, [
      set(state`toast`, null)
    ])
  ]
}
```

Since the **wait** operator returns an array we use the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) to merge the chain into our existing chain.

Now when we check again in the debugger you will see all the 3 actions executed when signal *buttonClicked* got triggered.

Still speaking of the debugger did you notice the **Input: {}** in front of every action executed? Looks quite empty. Let us change that!

### Actions

[Preview](05)

Run script from the command line to start:
`npm run start:ch 05`

Signals can take an input-object which then can be further processed by its actions.

Let us say you have a user input which should get written to state.
As we now know, the only correct way to write to state is to use **signals** with **actions**. In the previous chapters we have been using operators, but now we are going to create our very own action.

An action gives us access to the input-object, among other things. This input object can be populated when a signal triggers and it can also be extended by actions. Any object returned from an action will be merged into the current input and passed to the next action. Let us change our button click to rather take an input and change it:

```js
...
import {set, state, wait, input} from 'cerebral/operators'
...
{
  buttonClicked: [
    shoutIt,
    set(state`toast`, input`message`),
    ...wait(4000, [
      set(state`toast`, null)
    ])
  ]  
}
```

We would like to access the input-object from within our action.
So lets have a look at such a sample action. You can create on the lint above the instantiation of the controller:

```js
...
function shoutIt ({input}) {
  return {
    message: `${input.message}!!!`
  }
}

const controller = Controller(...)
```
As you can see actions receives an argument, which we [destructure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to grab the *input*. The argument itself is called the **context**. So **input** is on the **context**.

Now we just need to change our button click to actually pass a message (*src/components/Input/index.js*):

```js
import React from 'react'
import {connect} from 'cerebral/react'
import Toast from './Toast'

export default connect({
  title: 'title',
  subTitle: 'subTitle'
}, {
  buttonClicked: 'buttonClicked'
},
  function App (props) {
    return (
      <div className="o-container o-container--medium">
        <h1>{props.title}</h1>
        <h3>{props.subTitle}</h3>
        <button
          className="c-button c-button--info c-button--block"
          onClick={() => props.buttonClicked({
            message: 'Please shout me'
          })}
        >
          Update state
        </button>
        <Toast />
      </div>
    )
  }
)
```

Now we are ready to test drive our changes. Click the button and you should see the toast message appear with three exclamation marks behind. Please keep an eye on the **debugger**. You can track how the flow of the input between the actions as they execute. Keep in mind that the result object from an action will be merged with the input and handed over to the next action. You might just have well used a different property for the shouted message.

#### Challenge

- Add another custom action which transforms the input value to Uppercase. You may override existing properties on the input or create a new one

### Async actions

[Preview](06)

Run script from the command line to start:
`npm run start:ch 06`

Until now we have mostly used synchronous actions inside our **signals** and the flow was therefore straightforward. Example:

```js
{
  somethingHappened:[
    action1,
    action2
  ]
}
```
Because action2 appears after action1, action1 finishes before action2 starts. Clear enough. But now what happens when action1 executes asynchronously?

We already have an example of this in our code. The **wait** operator runs asynchronously. It runs for 4 seconds before the toast message is reset.

```js
{
  buttonClicked:[
    set(state`toast`, input`message`),
    ...wait(4000, [
      set(state`toast`, null)
    ])
  ]
}
```

The signal executes with the same behaviour, it waits for an action to resolve before moving to the next. Let us look at how **wait** is defined:

```js
function waitFactory (ms, continueChain) {
  function wait ({path}) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(path.timeout()), ms)
    })
  }

  return [
    wait, {
      timeout: continueChain
    }
  ]
}
```

We have just created a **factory**. A function that returns an action. The action itself (wait) returns a promise. This promise is what tells the signal to hold its execution until it is resolved.

Cerebral factories are not only restricted to actions, you can also have chain factories. Let us create our own custom **showToast** chain factory.

Instead of returning an action, we return a chain. As you can see we have moved the actions we defined previously into this array, using the arguments passed into the factory.

```js
...
function showToast(message, ms) {
  return [
    set(state`toast`, message),
    ...wait(ms, [
      set(state`toast`, null)
    ])
  ]
}
...
const controller = Controller(...)
```

We need to adjust *src/index.js*:
```js
{
  buttonClicked: [
    ...showToast(input`message`, 1000)
  ]
}
```

Again since **showToast** returns a chain we use the spread operator to merge into into our existing chain.

Congratulations! You have successfully mastered the power of factories. But there are couple of more concepts that will help you define state changes, jump over to the next chapter to find out more.

### Paths

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
    set(state`toast`, {message, type}),
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

#### Challenge

We would like you to run two getRepo(...) requests. One to *cerebral/cerebral* and one to *cerebral/addressbar*. So it is a good idea to make *getRepo* a factory instead. On their successes they should insert their data into the state tree. Also create an action that sums the stars and adds a third state in the state tree with the sum of both repos star count. This part requires you to read up on how to set and get state in actions. This sum action should run and be displayed in a toast after both *getRepo* are done running. Remove any other success and error toasts.

### Compute state

[Preview](08)

Run script from the command line to start:
`npm run start:ch 08`

In the previous challenge the solution was to use an action to sum the star counts together. It looks like this:

```js
function setStarsSum({state}) {
  state.set('starsSum',
    state.get('repos.cerebral.stargazers_count') +
    state.get('repos.addressbar.stargazers_count')
  )
}
```

This is a perfectly okay approach for our simple scenario, but computing state like this can be tedious in large applications. We might want to use this state multiple places in our application and we want to make sure it is the same wherever we use it.

In Cerebral we can automatically compute state using a **Computed**.

```js
import {Computed} from 'cerebral'

export default Computed({
  repos: 'repos'
}, ({repos}) => {
  return Object.keys(repos).reduce((currentCount, repoKey) => {
    return currentCount + repos[repoKey].stargazers_count
  }, 0)
})
```
This looks pretty similar to the component pattern. And it is actually doing pretty much the same thing under the hood.

Now whenever this *Computed* is accessed it is either using a cached value to return the result, or it will recalculate itself if the state path (*repos*) has changed since last time. Pretty cool!

Let us finish this example. To do so please create a new folder named *./src/computeds* and save a file named *starsSum.js* containing the snippet we just looked at. Then we would like to use our computed both in the signal and we also want to show the count in our component.

Let us remove the **setStarsSum** action and just use the computed directly:

```js
...
import starsSum from './computeds/starsSum'
...
{
  buttonClicked: [
    ...showToast('Loading data for repos...', 2000),
    [
      getRepo('cerebral'), {
        success: [set(state`repos.cerebral`, input`result`)],
        error: []
      },
      getRepo('cerebral-debugger'), {
        success: [set(state`repos.cerebral-debugger`, input`result`)],
        error: []
      }
    ],
    ...showToast(string`The repos have ${starsSum} stars`, 5000)
  ]
}
...
```

You can use computeds directly in operator tags, in actions and in components:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import starsSum from '../../computeds/starsSum'
import Toast from '../Toast'

export default connect({
  title: 'title',
  subTitle: 'subTitle',
  starsCount: starsSum
}, {
  buttonClicked: 'buttonClicked'
},
  function App (props) {
    return (
      <div className="o-container o-container--medium">
        <h1>{props.title}</h1>
        <h3>{props.subTitle}</h3>
        <button
          className="c-button c-button--info c-button--block"
          onClick={() => props.buttonClicked()}
        >
          Update star count ({props.starsCount})
        </button>
        <Toast />
      </div>
    )
  }
)
```
If you wonder why the button updates its star count before the toast, it is because we have said the "Loading data for repos" should stick for 2 seconds.

Thats it for now regarding *Computeds*. Of course summarizing some numbers is pretty simple stuff, but you can compute state into any result. Very powerful!

But now it has only been Cerebral stuff, what if you want to use other libraries in your action flow? Well, refill your coffee or open up another drink and enjoy the next chapter introducing **providers**.

### Providers

[Preview](09)

Run script from the command line to start:
`npm run start:ch 09`

Good news, we have already used a provider before. Do you remember the *http-provider* we are using to get data from servers?

A provider basically adds itself to the context object of our actions. Let us check out our existing code in *./src/index.js*:
```js
...
function getRepo(repoName) {
  function get({http, path}) {
    return http.get(`/repos/cerebral/${repoName}`)
      .then(response => path.success({data: response.result}))
      .catch(error => path.error({data: error.result}))
  }

  return get
}
...
```
Note the *http* - object on the context of the *get* action returned.

What needs to be done? Well not too much. Just add the provider in your controller in *./src/index.js*

Thats how it looks right now:
```js
...
import HttpProvider from 'cerebral-provider-http'
...
    providers: [
      HttpProvider({
        baseUrl: 'https://api.github.com'
      })
    ]
...
```

What are the **benefits** of using a provider in this way? Well we have decoupled the dependency of the HTTP tool in all our actions, meaning that when testing actions we can just pass in a fake HTTP tool. As well the **Debugger** can now track and visualize the execution of providers.

Just keep in mind that you could use any library as an provider, we've just used http-provider here because it is very lightweight and has some additional benefits when http-requests need to report back progress and the like (because it also uses Cerebral-Signals for doing that). Let us add another one. Why not provide additional logging functionality to our actions? Let us use [js-logger](https://github.com/jonnyreeves/js-logger) one.

We have already installed the library using npm. So it was sitting there and waiting and now the time is ready to use it!

Because we add a 3rd-party provider we need to wrap it up into a so called *ContextProvider* to get the benefits mentioned before.

So please add the following imports to your *./src/index.js*
```js
...
import logger from 'js-logger'
import {ContextProvider} from 'cerebral/providers'
...
logger.useDefaults()
...
```

Now we are ready to register it to our controller:
```js
...
  providers: [
    HttpProvider({
      baseUrl: 'https://api.github.com'
    }),
    ContextProvider({
      logger
    })
  ]
...
```

Now we have the logger in place so let us use it to track request times:
```js
function getRepo(repoName) {
  function get({logger, http, path}) {
    logger.time(`request ${repoName}`)
    return http.get(`/repos/cerebral/${repoName}`)
      .then(response => {
        logger.timeEnd(`request ${repoName}`)
        return path.success({data: response.result})
      })
      .catch(error => {
        logger.timeEnd(`request ${repoName}`)
        return path.error({data: error.result})
      })
  }

  return get
}
```

Now run your code and check the console after doing a request do a server.
Thats it! You have just successfully integrated another provider!

### Routing

[Preview](10)

Run script from the command line to start:
`npm run start:ch 10`

Now that our tutorial UI gets more complex it is a good idea to separate it a little bit. We want a home tab and a repos tab. Our two repos should load when we click the repos tab or hit the url directly.

Let us introduce the tabs first. We will just shove everything into our one component. Normally you would split this up into multiple components of course. You would probably also use JavaScript to map over a list of tabs or something similar, but let us be explicit now. Please change *./src/components/App/index.js* to:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import Toast from '../Toast'

export default connect({
  title: 'title',
  subTitle: 'subTitle',
  repos: 'repos',
  activeTab: 'activeTab'
}, {
  homeRouted: 'homeRouted',
  reposRouted: 'reposRouted'
},
  function App (props) {
    return (
      <div className="o-container o-container--medium">
        <h1>{props.title}</h1>
        <h3>{props.subTitle}</h3>
        <div className="c-tabs">
          <div className="c-tabs__headings">
            <div
              onClick={(event) => props.homeRouted()}
              className={`c-tab-heading ${props.activeTab === 'home' ? 'c-tab-heading--active' : ''}`}
            >
              Home
            </div>
            <div
              onClick={(event) => props.reposRouted()}
              className={`c-tab-heading ${props.activeTab === 'repos' ? 'c-tab-heading--active' : ''}`}
            >
              Repos
            </div>
          </div>
          <br />
          <div className={'c-tabs__tab' + (props.activeTab === 'home' ? 'c-tabs__tab--active' : '')}>
            <h5>Home page content</h5>
          </div>
          <div className={'c-tabs__tab' + (props.activeTab === 'repos' ? 'c-tabs__tab--active' : '')}>
            <ul>
              {Object.keys(props.repos).map((repoKey, index) => (
                <li key={index}>
                  {props.repos[repoKey].name} ({props.repos[repoKey].stargazers_count})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Toast />
      </div>
    )
  }
)
```

We also need to add new state in *./src/index.js*:
```js
...
{
  title: 'Hello from Cerebral!',
  subTitle: 'Working on my state management',
  toast: null,
  repos: {},
  activeTab: 'home'  
}
...
```
And update the signals as well:
```js
...
{
  homeRouted: [
    set(state`activeTab`, 'home')
  ],
  reposRouted: [
    set(state`activeTab`, 'repos'),
    [
      ...showToast('Loading data for repos...', 2000),
      getRepo('cerebral'), {
        success: [set(state`repos.cerebral`, input`data`)],
        error: []
      },
      getRepo('addressbar'), {
        success: [set(state`repos.addressbar`, input`data`)],
        error: []
      }
    ],
    ...showToast('Repos loaded', 2000, 'success')
  ]
}
...
```
Now you can testdrive your changes. You should see the first tab activated. Now go to debugger and change *activeTab* state to 'repos' and you will see the second tab. If you click the tabs you will actually trigger the signals which appears in the debugger. Nice! But what has this to do with Routing?

Traditional routers is a wrapper around your components and they manipulate what components to display based on the url. That is not how routing works in Cerebral. In Cerebral you connect urls to signals. So:

1. A url is hit or changed
2. The respective signal is triggered putting your application in the correct state
3. The components now renders based on the state of the application

This is a really good thing because most route changes requires quite a few state changes and side effects, like server requests, to be run. This is exactly what signals do so well.

Let us introduce **cerebral-router** to our project by adding an import to the top of our *./src/index.js*:

```js
import Router from 'cerebral-router'

```

And go ahead by doing the router config as follows inside the controller:
```js
...
const controller = Controller({
  devtools: Devtools(),
  router: Router({
    routes: {
      '/': 'homeRouted',
      '/repos': 'reposRouted'
    },
    onlyHash: true // Use hash urls
  })
  ...
})
...
```

As you can see, defining *routes* is as easy as linking them to *signals*. Now go to your browsers addressbar and enter *localhost/#/repos* and voilà the reposRouted signal gets called. And it also works the other way around. When you now click your tabs the url will also update!

#### Challenge

Go to your browsers addressbar and enter an invalid route like: localhost/#/*foo* and press Enter. Now check the console! The challenge is to add another route which catches those *unknown* routes, runs a signal and display a toast with an error.

### Modules

[Preview](11)

Run script from the command line to start:
`npm run start:ch 11`

Glad you are still with us! Hopefully you have enjoyed our journey so far and hopefully you still have a sip left of your coffee or drink. It's time for cleaning up.

Welcome to the world of **modules**. We will build the following structure:

```
.
├── public
|	├── index.html
|	└── ...
├── src
|	├── components
|	|	├── App
|	|	├── Toast
|	├── modules
|	|	├── Home
|	|	├── Repos
|	└── index.js
├── package.json
├── ...
```

Our *./src/index.js* looks a lot cleaner and we have put our code into the conventional folders recommended by the Cerebral community. Let us look closer at the changes:

```js
...
import app from './modules/app'
import home from './modules/home'
import repos from './modules/repos'
...
const controller = Controller({
  modules: {app, home, repos}
  ...
})
...
```

First of all we now load all our state and signals from modules. An example of a module is:

```js
import openRepos from './chains/openRepos'

export default {
  state: {
    list: {}
  },
  signals: {
    routed: openRepos
  }
}
```

The signals references chain that lives in their own files. This makes it super easy to compose chains into multiple signals.

The only difference now is that the modules namespaces our state and signals, which means we need to prefix the pointers in the router and components to the correct path.

```js
export default connect({
  title: 'app.title',
  subTitle: 'app.subTitle',
  repos: 'repos.list',
  activeTab: 'app.activeTab'
}, ...)
```

So there is no magic to **modules**, they just namespace signals and state. There is no isolation going on. Any module can change any state of the application. This prevents you from getting into problems as your application grows.

Congratulations! You have reached the end of our *Get Started* - tutorial.
There is a lot of other good stuff on this website. So please check it out!

As a **last challenge**: Build your next big thing with **Cerebral** and please tell us about it on [discord chat](https://discord.gg/0kIweV4bd2bwwsvH) :)
