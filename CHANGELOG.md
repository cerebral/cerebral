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
