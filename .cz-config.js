'use strict'

module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    { value: 'typing', name: 'typing:   Typescript/Typing related changes' },
    { value: 'test', name: 'test:     Adding missing tests' },
    {
      value: 'refactor',
      name: 'refactor: A code change that neither fixes a bug nor adds a feature',
    },
    {
      value: 'perf',
      name: 'perf:     A code change that improves performance',
    },
    {
      value: 'build',
      name: 'build:    Changes that affect the build system or external dependencies',
    },
    {
      value: 'ci',
      name: 'ci:       Changes to our CI configuration files and scripts',
    },
    {
      value: 'chore',
      name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation',
    },
    {
      value: 'style',
      name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)',
    },
    { value: 'revert', name: 'revert:   Revert to a commit' },
  ],

  scopes: [
    { name: 'cerebral' },
    { name: 'function-tree' },
    { name: 'website' },
    { name: 'react' },
    { name: 'inferno' },
    { name: 'preact' },
    { name: 'vue' },
    { name: 'angular' },
    { name: 'babel-plugin' },
  ],

  // it needs to match the value for field type. Eg.: 'fix'
  scopeOverrides: {
    chore: [],
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix', 'refactor', 'perf'],
  appendBranchNameToCommitMessage: false,
}
