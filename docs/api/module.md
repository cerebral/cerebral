# Module

The module is how you structure your application, it holds:

```js
{
  state,
  sequences,
  reactions,
  providers,
  catch,
  modules,
}
```

You instantiate your application with a root module:

```js
const app = App({
  state: {}
})
```

And you extend this root module with nested modules:

```js
const app = App({
  state: {},
  modules: {
    moduleA,
    moduleB
  }
})
```
