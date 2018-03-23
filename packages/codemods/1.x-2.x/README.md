# Codemods for convert Cerebral 1.x to Cerebral 2.x

These are scripts that can be used to automatically upgrade deprecations between the 1.x and 2.x
branches of cerebral.

### Usage

## Make jscodeshift available globally

```shell
npm install -g jscodeshift
```

## Using a codemod

Apply a codemod to your source code directory (this will recursively apply
to all files inside) using jscodeshift.

This will alter code directly, so be sure that your code
has been versioned before attempting the mod.

eg:

```shell
jscodeshift -t cerebral/codemods/1.x-2.x/operators.js path/to/your/src
```

For a better idea of what each codemod does, you can view the `__testfixtures__` folder to show
the transformation between input (from 1.x) to output (to 2.x).

**Note:** some codemods may alter styling of your code. Due to the way jscodeshift inserts/deletes
lines, this unfortunately can't be avoided, so there may be some manual fixes required.

### Development

## Installing

Run at the root of monorepo

```shell
lerna bootstrap --scope cerebral-codemods_1.x-2.x
```

For testing:

```shell
npm test # at codemods root
# or
lerna run test --scope cerebral-codemods_1.x-2.x # at monorepo root
```
