import {input, set, state, string, when} from 'cerebral/operators'

export default function paths (moduleName) {
  return {
    collectionPath: `${moduleName}.all`,
    draftPath: `${moduleName}.$draft`,
    filterPath: `${moduleName}.$filter`,
    errorPath: `app.$error`,
    dynamicPaths: [
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
}
