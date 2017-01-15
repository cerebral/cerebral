import {signal, state} from 'cerebral/tags'
import visibleKeys from '../computed/visibleKeys'
import paths from '../paths'

export default function connectProps (moduleName, extraprops) {
  const {draftPath, filterPath} = paths(moduleName)
  const props = {
    enterPressed: signal`${moduleName}.filterEnterPressed`,
    filter: state`${filterPath}`,
    onChange: signal`${moduleName}.filterChanged`,
    onClick: signal`${moduleName}.addClicked`,
    selectedKey: state`${draftPath}.key`,
    visibleKeys: visibleKeys(moduleName)
  }
  if (extraprops) {
    return Object.assign(props, extraprops)
  } else {
    return props
  }
}
