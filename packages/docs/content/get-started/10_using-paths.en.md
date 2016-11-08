---
title: Control flow using Path
---

## 10: Control flow using Path

`npm run ch09`


In the chapter before we were introducing async actions and we have learned that we can write async actions that just behave like an sync action in the chain.
But what about the following scenario: User gets data async from a server, server responds with an error, what now? To handle not only the so called *Happy Path* we should also allow our signals to branch out into a different flow (which is just another chain of actions and operators) depending on the result of the async action.
So let us build that scenario introducing *cerebral-http-provider*. *cerebral-http-provider* is a simple http-provider which enables you to request data from servers.  The concept of **Providers** will be covered in more detail in the next chapter. As well we took the chance to spice up the tutorial a bit and also include the http-provider plus an action already using it. 
So please go ahead and **do a** `npm run ch10_1` **before you dive into the following steps**.

### A few words about the work done

If you check out the application now you will see another input-field and a button.
By default this button will query the github api to get information about the cerebral-project.
If you press this button you should see some information as a *Toast* -message.
Nice but what if we change the input from *cerebral* to *doesnotexist* and again query the server by pressing the button? Well we still see a toast-message with now some misleading information (it looks ok at first sight). But the console (or network tab in the devtools of your browser) will reveal that something is going wrong.
Lets call the concept of **Paths** to the rescue!


A simple signal using paths and a sample async action named *getData* could look like this:
```js
signals:
getServerData:[
getData, 
  {
  success:[processResults, showSuccessMessage], 
  error: [showErrorMessage]
  }
]
```

Whereas *success:* and *error* are our **Paths**

Well that would be cool, let us implement it into our existing *getRepoInfoClicked* - signal inside our controller:

```js
...
    getRepoInfoClicked: [
      set(state`repoName`, input`value`),
    
       ...showToast('Loading Data for repo: @{repoName}', 2000),
       GetData,
       {
          success: [
            set(state`data`, input`result`),
            ...showToast('How cool is that. @{repoName} has @{data.subscribers_count} subscribers and @{data.stargazers_count} stars!', 5000,  "success")
         ],
         error: [set(state`data`, input`result`), 
         ...showToast('Ooops something went wrong: @{data.message}', 5000, "error")]
        }
      
    ]
...
```

As you can see you can config as many paths as you like. Just make sure to add the *,{...}* - block after the async action which controls them.
And in our GetData - action we need to output  to different **Paths** now as follows:

```js
function GetData({input, state, http, path}) {
  return http.get("/repos/cerebral/" + input.value)
    .then(response => {
      return path.success({
        result: response.result
      })
    })
    .catch(error => {
      return path.error({
        result: error.result
      })
    })
}
```

As you can see using *path* we can tell Cerebral which Path it should take next when the promise resolves.

Now when you check out the application do you discover another candidate for using **Path** ?
Did you recognise that the message *Loading Data for repo...* is blocking the full process for 2 secs?
Sometimes it would be quite cool to indicate to Cerebral that actions could get executed in parallel without waiting for eachother to finish. Relax and take a sip from your coffee or beer, Cerebral has you covered!
Replace your Signal with the following snippet:

```js
...
  getRepoInfoClicked: [
    set(state`repoName`, input`value`),
    [
      ...showToast('Loading Data for repo: @{repoName}', 2000),
      GetData,
      {
        success: [
          set(state`data`, input`result`),
          ...showToast('How cool is that. @{repoName} has @{data.subscribers_count} subscribers and @{data.stargazers_count} stars!', 4000, "success")
        ],
        error: [
          set(state`data`, input`result`),
          ...showToast('Ooops something went wrong: @{data.message}', 4000, "error")
        ]
      }
    ]
  ]
...

```

What is happening here? Did you recognise the additional **[** and **]** Well whenever Cerebral encounters an Array in a Array  **[action1,[action2,action3],action4]** it will start the actions within that array in parallel, so after action1 finishes action2 & action3 are executed in parallel. And after those two guys finsihed action4 will be executed.Really cool! We can control flow now and even tell Cerebral to execute Actions/Operators in parallel by just using JS-Arrays and Objects. So by just reading the Signals one can get a good understanding what the application will do. And don't forget, there is also the debugger reflecting state-changes and even displaying the **Paths** which were chosen.

As you maybe have recognised the *Loading Data for repo ...*-Message doesn't appear anymore. Well we should be able to explain that already. It is because we have introduced the additional *[* and *]* so everything inside this chain gets executed in parallel. That is also true for resetting our messages. So our message now basically gets set and resetted immediately. You may check the debugger to see this as well.
Another little issue with the current toast-method we are currently using: If we ouput "Loading Data..." and set it to 4 secs, but the server is really slow and it takes 20 secs, the message would disappear way too early.

Let us fix both issues by using the following code:

```js
...
    getRepoInfoClicked: [
      set(state`repoName`, input`value`),
      ...showToast('Loading Data for repo: @{repoName}', 0),
      GetData,
      {
        success: [
          set(state`data`, input`result`),
          ...showToast('How cool is that. @{repoName} has @{data.subscribers_count} subscribers and @{data.stargazers_count} stars!', 0, "success")
        ],
        error: [
          set(state`data`, input`result`),
          ...showToast('Ooops something went wrong: @{data.message}', 0, "error")
        ]
      }
      ,
      ...showToast('Load Data finished', 2000)
    ]
...

```
Whereas the 0 in ```...showToast('Loading Data for repo: @{repoName}', 0)``` tells the Factory to not use a promise (for removing the toast) so it leaves the toast there as long as for example ```...showToast('Load Data finished', 2000)``` gets called. So a 0 means: Hey i'm a grouped toast, leave me there and a value x > 0  means that it gets removed automatically by our async action after x milliseconds together with all the toasts before that where grouped by using the 0.
This enables nice grouped messages which integrates seamlessy into the Cerebral Action flow without blocking it.
 
To make this happen we need to adjust the *showToast(..)* - Factory to return a **Path-Chain** or just the action depending on the value of the function parameter *milliseconds*.
Don't worry now if that code still looks a bit alien to you. It also shows off the power of using **Factories**

```js
function showToast (message, milliseconds, type) {
  var isAsync = milliseconds || (message && milliseconds === undefined) || (message === undefined && milliseconds === undefined)
  function action ({input, state, path}) {
    // api sugar to make showToast(2000), showToast() work
    let ms = 0
    let msg = ''
    if (message && milliseconds === undefined) {
      ms = message
      msg = ''
    } else if (milliseconds) {
      ms = milliseconds
    } else if (message === undefined && milliseconds === undefined) {
      ms = 5000
    }
    msg = message || input.value
    // replace the @{...} matches with current state value
    if (msg) {
      let reg = new RegExp(/@{.*?}/g)
      var matches = msg.match(reg)
      if (matches) {
        matches.forEach(m => {
          let cleanedPath = m.replace('@{', '').replace('}', '')
          msg = msg.replace(m, state.get(cleanedPath))
        })
      }
    }
    let newMsg = {
      msg: msg,
      type: type,
      timestamp: Date.now(),
      id: Date.now() + '_' + Math.floor(Math.random() * 10000),
      grouped: !isAsync
    }
    state.unshift('toast.messages', newMsg)
    if (isAsync) {
      return new Promise(function (resolve, reject) {
        window.setTimeout(function () {
          resolve(path.timeout({
            id: newMsg.id
          }))
        }, ms)
      })
    }
  }
  action.displayName = 'showToast'
  if (!isAsync) {
    return [action]
  }
  return [action, {
    timeout: [
      removeToast
    ]
  }
  ]
}

```
As you can see we return now either just the action, or to get back to our tutorial goal here, the **Path-Chain** which includes the *timeout*-key to which our promise resolves to.
We have also included a *id* into our message-object which we use when we resolve the promise. Thats not only a good thing for the Viewengine (React needs a ```key={}``` for rendering lists for internal optimisations) but also for our *removeToast(...)* method which we need to add as well to our *./src/index.js*:
```js
function removeToast({input, state}) {

  let res1 = state.get('toast.messages').filter(function(msg) {
    return msg.id === input.id
  })
  let res = state.get('toast.messages').filter(function(msg) {
    return !(msg.id === input.id || (msg.grouped && msg.timestamp <= res1[0].timestamp))
  })
  state.set('toast.messages', res)
}

```
removeToast(..) will return a new array of messages which doesn't contain the toast which needs to be removed and also the grouped toasts if any. Your app is now ready to testdrive!

Congratulations! Now you know how to control your flow using **Path**. And if you need **parallel Actions/Operators**, well just add another array**[]** to the chain, thats it!