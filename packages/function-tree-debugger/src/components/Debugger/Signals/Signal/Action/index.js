import './styles.css'
import React from 'react'

import Inspector from '../../../Inspector'
import Service from './Service'

function Action ({action, execution, children, onMutationClick, onActionClick}) {
  function getActionName () {
    var regex = /\(([^()]+)\)/
    var match = regex.exec(action.name)
    return {
      name: match ? action.name.substr(0, match.index).trim() : action.name.trim(),
      params: match ? match[1] : null
    }
  }

  function getLineNumber () {
    const variable = action.error.name === 'TypeError' && action.error.message.match(/'(.*?)'/) ? action.error.message.match(/'(.*?)'/)[1] : action.error.message.split(' ')[0]
    const lines = action.error.stack.split('\n')
    return lines.reduce((lineNumber, line, index) => {
      if (lineNumber === -1 && line.indexOf(variable) >= 0) {
        return index + 1
      }
      return lineNumber
    }, -1)
  }

  function renderActionTitle () {
    const actionName = getActionName()
    return (
      <div className='action-actionTitle'>
        {actionName.name}
        {actionName.params ? <span className='action-actionNameParams'>{actionName.params}</span> : null}
      </div>
    )
  }

  return (
    <div className={action.error ? 'action action-actionError' : 'action'}>
      <div
        className={action.error ? 'action-actionErrorHeader' : 'action-actionHeader'}
        onClick={() => onActionClick(action)}>
        {action.error ? <i className='icon icon-warning' /> : null}
        {action.isAsync ? <i className='icon icon-asyncAction' /> : null}
        {renderActionTitle()}
      </div>
      {action.error ? (
        <div className='action-error'>
          <strong>{action.error.name}</strong> : {action.error.message}
          <pre data-line={getLineNumber()}>
            <code className='language-javascript' dangerouslySetInnerHTML={{__html: action.error.stack.split('\n').filter((line) => line.trim() !== '').join('\n')}} /></pre>
        </div>
      ) : null}
      {!action.error && execution ? (
        <div>
          <div className='action-actionInput'>
            <i className='icon icon-down' />
            <div className='action-inputLabel'>Input:</div>
            <div className='action-inputValue'><Inspector value={execution.payload} /></div>
          </div>
          <div className='action-services'>
            {execution.data.filter(data => data.type !== 'mutation').map((service, index) => <Service service={service} key={index} />)}
          </div>
          {children}
        </div>
        ) : null}
    </div>

  )
}

export default Action
