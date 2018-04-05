'use strict'

module.exports = {

  types: [
    {value: 'feat', name: 'feat:     A new feature'},
    {value: 'fix', name: 'fix:      A bug fix'},
    {value: 'docs', name: 'docs:     Documentation only changes'},
    {value: 'style', name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)'},
    {value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature'},
    {value: 'perf', name: 'perf:     A code change that improves performance'},
    {value: 'test', name: 'test:     Adding missing tests'},
    {value: 'chore', name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation'},
    {value: 'revert', name: 'revert:   Revert to a commit'},
    {value: 'ts', name: 'ts:   Typescript/Typings related changes'}
  ],

  scopes: [
    {name: 'Controller'},
    {name: 'Computed'},
    {name: 'DependencyStore'},
    {name: 'Model'},
    {name: 'Module'},
    {name: 'Views'},
    {name: 'Operators'},
    {name: 'Devtools'},
    {name: 'Providers'},
    {name: 'router'},
    {name: 'function-tree'},
    {name: 'demos'},
    {name: 'todomvc'},
    {name: 'forms'},
    {name: 'http'},
    {name: 'useragent'},
    {name: 'shortcuts'},
    {name: 'firebase'},
    {name: 'firebase-admin'},
    {name: 'storage'},
    {name: 'website'},
    {name: 'tutorial'},
    {name: 'react'},
    {name: 'inferno'},
    {name: 'preact'},
    {name: 'vue'},
    {name: 'angular'},
    {name: 'mobx'},
    {name: 'fluent'},
    {name: 'proxy'}
  ],

  // it needs to match the value for field type. Eg.: 'fix'
  scopeOverrides: {
    chore: []
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  appendBranchNameToCommitMessage: false
}
