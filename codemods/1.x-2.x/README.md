# Codemods for convert Cerebral 1.x to Cerebral 2.x

These are scripts that can be used to automatically upgrade deprecations between the 1.x and 2.x
branches of cerebral.

### Development

## Installing

Run at the root of monorepo

```shell
lerna bootstrap --scope @cerebral/codemods
```

For testing:

```shell
npm test # at codemods root
# or 
lerna run test --scope @cerebral/codemods # at monorepo root
```
