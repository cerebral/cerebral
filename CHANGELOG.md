# 0.17.1
> Changes since 0.16

[3c09054](https://github.com/christianalfoni/cerebral/commit/3c090548029bdc06d3978ce8e553735f408cb3ca)
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
