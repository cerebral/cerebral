import './styles.css'
import React from 'react'

export default function StatePaths (props) {
  let uniqueComponents = []

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
          <div className='statePaths-components'>
            {Object.keys(props.map).reduce((count, key) => {
              const components = props.map[key].filter(component => uniqueComponents.indexOf(component) === -1)
              uniqueComponents = uniqueComponents.concat(components)
              return count + components.length
            }, 0)} {' '} <small>registered components</small>
          </div>
        </div>
        {Object.keys(props.map).map(key => {
          return (
            <div
              key={key}
              className='statePaths-item'
              onClick={() => this.componentMapPathClick({
                mapPath: key
              })}
            >
              <div className='statePaths-pathName'>{key}</div>
              <div className='statePaths-components'>
                {props.map[key].map((component) => {
                  return component.name
                }).join(', ')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
