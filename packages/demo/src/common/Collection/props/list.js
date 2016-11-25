import visibleKeys from '../computed/visibleKeys'
import paths from '../paths'

export default function connectProps (moduleName) {
  const {draftPath, filterPath} = paths(moduleName)
  return {
    visibleKeys: visibleKeys(moduleName),
    filter: filterPath,
    selectedKey: `${draftPath}.key`
  }
}
