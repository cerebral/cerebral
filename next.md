## How to test new packages for Cerebral

### Install Cerebral
`npm install cerebral@next`
- computed removed from Cerebral and put into own package (see below)

New signature:

```javascript
import {Controller, Computed, ServerController} from 'cerebral'
```

### Models
`npm install cerebral-model` (state-tree)
- new mutable state tree which handles references

`npm install cerebral-model-immutable` (baobab)
- same as before, but emits a "flush" event with changed paths

### Views
`npm install cerebral-view-react@next`
- Optimized rendering and reports rendering to debugger

`npm install cerebral-view-snabbdom@next`
- Optimized rendering and reports rendering to debugger
- No more "use a key to optimize", works out of the box

### Devtools
`npm install cerebral-model-devtools@next`
- Make sure you have latest debugger version, 0.46
- Has a new "components" tab
