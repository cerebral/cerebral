---
title: Compute State
---

## 12: Compute State

`npm run ch11`

Coming back to the challenge we did before. The solution we wanted you to go through was to use another action that just adds state values and save the result in a new state value.
We are speaking of this
```js
function addStars ({state}) {
  state.set('totalStarsCount', state.get('cerebralStarsCount') + state.get('cerebralDebuggerStarsCount'))
}
```
Hmmm...Now we always need to call addStars(...) before using the Result. We can do better!
Let us look at TotalStarsCount like it would be a View (think Database-Views or Components like we already use)
In our components we already used a pattern like:
```js
import { connect } from 'cerebral/react'
export default connect({
  value: 'originalValue'
}
...
```
That means that this view is dependent on the 'originalValue' - State and it rerenders whenever that changes.
Well we have good news. It is high time to introduce **Computeds** which also makes use of *state-paths*. A *Computed* for this TotalStarsCount-Usecase could look like this:
```js
import { Computed } from 'cerebral'

export const getStars = Computed({
  cerebralStars: 'cerebralStarsCount',
  cerebralDebuggerStars: 'cerebralDebuggerStarsCount'
}, ({cerebralStars, cerebralDebuggerStars}) => {
  return cerebralStars + cerebralDebuggerStars
})
```
Wow, this looks pretty similar like the components-pattern from before. And it is doing quite a similar thing. We can see that this *Computed* is depending on two State Values and just returns the Sum of those two.
Now whenever this *Computed* is accessed it is either using a cached value to return the result, or it will recalculate itself if one of the *state-paths* changed meanwhile (cerebralStarsCount or cerebralDebuggerStarsCount). Pretty cool! (Compare this to concepts in other MVC-frameworks which will possibly always recalculate the values or introduce complexity because of handling and comparing changes)

Let us finish this example. To do so please create a new folder named *./src/computeds* and save a file named *getStars.js* containing the snippet we just have looked at.

Then we would like to access our computeds from within our showToast-Factory. We already have a simple "Convenience-Parser" - there which extracts State-Values whenever a *@{...}* is found in the text.
To do the same for *Computed*-Values we just need to replace the existing parser part with:

```js
...
    // replace the @C{...} matches with current computed value
    if (msg) {
      let reg = new RegExp(/@C{.*?}/g)
      var matches = msg.match(reg)
      if (matches) {
        matches.forEach(m => {
          let cleanedPath = m.replace('@C{', '').replace('}', '')
          msg = msg.replace(m, state.compute(computeds[cleanedPath]))
        })
      }
      // replace the @{...} matches with current state value
      reg = new RegExp(/@{.*?}/g)
      matches = msg.match(reg)
      if (matches) {
        matches.forEach(m => {
          let cleanedPath = m.replace('@{', '').replace('}', '')
          msg = msg.replace(m, state.get(cleanedPath))
        })
      }
    }
...
``` 
And don't forget to import our computed
```js
import  * as computeds  from './computeds/getStars' 
```
at the top of *./src/index.js*

So our parser will now automatically replace *$C{...}* - placeholders with the current computed value.

Let us change our existing *starCountClicked* - Signal to make use of this new placeholder.

Just replace the last showToast(...) with:
```js
...showToast(`Total Stars @C{getStars}`, 3000)
```

Now we can **get rid** off our addStars-Action. It is not needed anymore:
```js
addStars,
```

As you can see now we can access computeds from within actions. Thats great, but what about our components in the view?
**Cerebral** has you covered here as well. Let us output the computed result as well into our StarButtonCount-Component:
```js
import React from 'react'
import { connect } from 'cerebral/react'
import { getStars } from '../../computeds/getStars'
export default connect({
  total: getStars
}, {
  buttonClicked: 'starCountClicked'
}, function StarCountButton (props) {
  return (
    <div>
      <button onClick={() => props.buttonClicked()} className='c-button c-button--brand c-button--block'>
        Get Total Stars for Cerebral and Cerebral - Debugger ({props.total})
      </button>
    </div>
  )
}
)
```
Thats it for now for *Computeds*. Of course adding two simple state-values is just a very simple usecase. Basically you can transform state into any result.
Very powerful!

As you have seen up to now we can customize and introduce magic in *Actions* and even go a bit crazy using *Factories* (eg. showToast(...))

What now if you have a nice JS - Library which you would like to have introduced nicely into your action flow?

Well, refill your coffee or open up another drink and enjoy the next chapter introducing **Providers**