import { set, when } from 'cerebral/operators'
import { props, state, string } from 'cerebral/tags'

export default function paths(moduleName) {
  return {
    collectionPath: `${moduleName}.all`,
    draftPath: `${moduleName}.$draft`,
    filterPath: `${moduleName}.$filter`,
    errorPath: `app.$error`,
    dynamicPaths: [
      set(
        props`remoteCollectionPath`,
        string`${state`user.$currentUser.uid`}.${moduleName}`
      ),
      when(props`key`),
      {
        true: [
          set(props`itemPath`, string`${moduleName}.all.${props`key`}`),
          set(
            props`remoteItemPath`,
            string`${props`remoteCollectionPath`}.${props`key`}`
          ),
          set(
            props`remoteItemImagePath`,
            string`${props`remoteItemPath`}.image`
          ),
        ],
        false: [],
      },
    ],
  }
}
