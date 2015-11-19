# 0.24.0
- Updated the computed experiment. Read more in release notes
 
# 0.23.0
### Updates
- Cerebral will now ignore signals when looking into the past. The reason for this is to prepare for observables/streams. It also solves any issues with timeouts etc. which makes it hard to do debugging. Move back to present to continue "into the future" :-)
- You can now disable the debugger. Cerebral will still store signals, but not pass them to the debugger. When enabling the debugger again it will update itself with the latest state
- Signals are now not stored in production, one step closer to official production support :-)

### Migration guide
- Cerebral-Debugger v0.20
- Cerebral v0.22.0

# 0.21.0
This version just has performance improvements on the debugger, use latest version: 0.19.0 of the debugger with this version of Cerebral

# 0.20.2
- Several updates to the webpage
- IE 9 support
- Signals will not fail with no actions
- `unset` can now take a second array argument to unset multiple keys on objects
- `defaultInput` can now be attached to an action to set default inputs to that action
- The **experimental** compute functions are in
- State packages now uses a concept of *accessors*. Now you can use `state.key(path)` and `state.findWhere(path, checkObj)` in addition to `state.get(path)`. You can also use `state.export()` for guaranteed serialized version of store and `state.import(obj)` to deep merge state
- Fixed error on custom outputs where indexes were shown in error instead of output names
- Synchronous actions running async output now throws error
- Now all signal are defined with an array `signal('appMounted', [syncAction])`. You will getting a DEPRECATION warning if not doing so. The reason is that signals are most commonly defined in separate files as arrays. It will also be easier for new devs to learn how to read signals. "Arrays inside arrays means actions runs async". "Arrays defined as paths runs sync"
- By default signals are **not** stored in localStorage on refresh. People not using the debugger should not have an insane amounts of signals in their local storage :-) Will also make sure that if the debugger has not been registered to the app it will not store signals, even though it is set to do so

# 0.19.4
- The debugger has been updated
- Buttons to step, instead of slider
- Now always remembers state
- You can check/uncheck if you want to reset state on refresh
- Fixed issues with Baobab Monkeys


# 0.19.0
- Namespace signals
- Better error on non serializable inputs
- Passing the signal itself on `signalStart` and `signalEnd` events
- Naming actions
- `import` and `export` methods exposed on the state store
- The recorder is now a default service
- Durations are displayed in the debugger
- Signals now has a `sync` method on them to trigger the signal synchronously (for inputs etc.)
- A couple of small UI fixes on the debugger
- Paths on sync actions now remembered correctly
- Increased debugger debounce to 100ms. Fixes problem where lots of signals trigger

# 0.18.4
> Changes since 0.17.7

* Cerebral internally performs for analysis for signal chains, which required changes to several tests and other bugfixes. No changes to the api.

# 0.17.7
> Changes since 0.17.1

[6ce0628](6ce06283029e93de9c045d8bd827dfaee7a0cdf5)
* `remember` event is removed; use `change` event instead

[91a7355](91a73559a3265e42b2b924c63eb9398f733ad422)
* More descriptive error messages are thrown when creating a signal chain, when an action is undefined or an async action is not wrapped in an array

[536f23](536f232d3416750f1b769686d480c1ff43775a9c)
* Cerebral debugger must now to manually started; The required can be accessed from the controller instance as `controller.devtools`
```
// Create cerebral controller normally
const controller = cerebral.Controller(yourModel, { your: 'services' });

// Start the debugger
controller.devtools.start();

```


# 0.17.1
> Changes since 0.16

[3c09054](3c090548029bdc06d3978ce8e553735f408cb3ca)
* `defaultInputs` are no longer merged with action inputs; instead `services` are available in actions as the 4th argument

```javascript
/////////////////
// Previously  //
/////////////////
const defaultInputs = { utils: { request: request } };
const controller = new Controller(model, defaultInputs);

function action (inputs, state, outputs) {
    inputs.utils.request();
}

/////////
// Now //
/////////

const services = { request: request };

function action (inputs, state, outputs, services) {
    services.request();
}
```
* models must implement additional `toJSON` method for logging from the debugger
