import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import classnames from 'classnames'

function Apps (props) {
  return (
    <div className='apps-bar'>
      {Object.keys(props.apps).map((port) => {
        return (
          <div
            key={port}
            className={classnames('apps-item', {
              'apps-item-active': port === props.currentPort
            })}
            onClick={() => props.changePort(port)}
          >
            <div>
              {props.apps[port].name} <small>({port})</small>
              <i
                className='apps-remove'
                onClick={(event) => {
                  event.stopPropagation()
                  props.removePort(port)
                }}
              >
                x
              </i>
            </div>
          </div>
        )
      })}
      <div
        className='apps-item apps-add'
        onClick={props.addNewPort}
      >
        +
      </div>
    </div>
  )
}

export default Apps
