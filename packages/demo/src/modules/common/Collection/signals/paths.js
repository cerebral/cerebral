import {input, set, state, string, when} from 'cerebral/operators'

export function paths (moduleName) {
  return {
    collectionPath: `${moduleName}.all`,
    draftPath: `${moduleName}.$draft`,
    filterPath: `${moduleName}.$filter`,
    errorPath: `app.$error`
  }
}

export function setPaths (moduleName) {
  return [
    set(
      input`remoteCollectionPath`, string`${state`user.$currentUser.uid`}.${moduleName}`
    ),
    when(input`key`), {
      true: [
        set(
          input`itemPath`, string`${moduleName}.all.${input`key`}`
        ),
        set(
          input`remoteItemPath`,
          string`${input`remoteCollectionPath`}.${input`key`}`
        )
      ],
      false: []
    }
  ]
}
