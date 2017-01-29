import './styles.css'
import Inferno from 'inferno'

export default function StatePaths (props) {
  let uniqueComponents = []
  const componentsCount = Object.keys(props.map).reduce((count, key) => {
    const components = props.map[key].filter(component => uniqueComponents.indexOf(component) === -1)
    uniqueComponents = uniqueComponents.concat(components)
    return count + components.length
  }, 0)
  const componentsWithStatePaths = Object.keys(props.map).reduce((components, stateKey) => {
    const statePathComponents = props.map[stateKey]

    return statePathComponents.reduce((allComponents, component) => {
      if (!allComponents[component.id]) {
        allComponents[component.id] = {name: component.name, paths: []}
      }
      allComponents[component.id].paths.push(stateKey)

      return allComponents
    }, components)
  }, {})

  return (
    <div className='statePaths-wrapper'>
      <div className='statePaths-componentsWrapper'>
        <div
          key='header'
          className='statePaths-itemHeader'
        >
          <div className='statePaths-pathName'>
            {Object.keys(props.map).length} <small>active state paths</small>
          </div>
          <div className='statePaths-components'><span>{componentsCount} <small>registered components</small></span></div>
        </div>
        {Object.keys(componentsWithStatePaths).map(key => {
          return (
            <div
              key={key}
              className='statePaths-item'
              onClick={() => this.componentMapPathClick({
                mapPath: key
              })}
            >
              <div className='statePaths-pathName'>{componentsWithStatePaths[key].name}</div>
              <div className='statePaths-components'>
                {componentsWithStatePaths[key].paths.join(', ')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
