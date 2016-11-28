import {Computed} from 'cerebral'
import paths from '../paths'
import sort from '../sort'

export default function (moduleName) {
  const {collectionPath, draftPath, filterPath} = paths(moduleName)

  return Computed(
    {
      items: `${collectionPath}.**`,
      afilter: filterPath,
      selectedKey: `${draftPath}.key`
    },
    ({items, afilter, selectedKey}) => {
      const filter = afilter && afilter.toLowerCase()
      const list = Object.keys(items).filter(key => (
        !filter || items[key].name.toLowerCase().indexOf(filter) >= 0
      ))
      if (selectedKey && list.indexOf(selectedKey) < 0) {
        // Always show edited item (also if it is not saved yet)
        list.unshift(selectedKey)
      }
      return list.sort(sort)
    }
  )
}
