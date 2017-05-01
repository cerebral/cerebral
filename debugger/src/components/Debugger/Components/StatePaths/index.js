import './styles.css'
import Inferno from 'inferno' // eslint-disable-line

export default function StatePaths (props) {
  const componentsWithStatePaths = Object.keys(props.map).reduce((components, stateKey) => {
    const statePathComponents = props.map[stateKey]

    return statePathComponents.reduce((allComponents, component) => {
      if (!allComponents[component.id]) {
        allComponents[component.id] = {name: component.name, paths: [], renderCount: component.renderCount}
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
          <div className='statePaths-components'><span>{Object.keys(componentsWithStatePaths).length} <small>registered components</small></span></div>
        </div>
        {Object.keys(componentsWithStatePaths).filter((key) => {
          return props.filter ? componentsWithStatePaths[key].paths.reduce((hasPath, path) => {
            return hasPath || path.indexOf(props.filter) >= 0
          }, false) : true
        }).map((key) => {
          return (
            <div key={key} className='statePaths-item'>
              <div className='statePaths-pathName'>
                {componentsWithStatePaths[key].name} {componentsWithStatePaths[key].renderCount === 0 ? null : <small>({componentsWithStatePaths[key].renderCount})</small>}
              </div>
              <div className='statePaths-components'>
                {componentsWithStatePaths[key].paths.map((path) => (
                  <div>{path}</div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
