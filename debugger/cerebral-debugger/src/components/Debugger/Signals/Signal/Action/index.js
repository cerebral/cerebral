import './styles.css'
import React from 'react'

import Inspector from '../../../Inspector'
import Mutation from './Mutation'
import Service from './Service'

function Action ({action, execution, children, onMutationClick, onActionClick}) {
  const error = execution && execution.error

  function getActionName () {
    var regex = /\(([^()]+)\)/
    var match = regex.exec(action.name)
    return {
      name: match ? action.name.substr(0, match.index).trim() : action.name.trim(),
      params: match ? match[1] : null
    }
  }

  function getLineNumber () {
    const variable = error.name === 'TypeError' && error.message.match(/'(.*?)'/) ? error.message.match(/'(.*?)'/)[1] : error.message.split(' ')[0]
    const lines = error.func.split('\n')

    return lines.reduce((lineNumber, line, index) => {
      if (lineNumber === -1 && line.indexOf(variable) >= 0) {
        return index + 2
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

  function renderCode () {
    return error.func.split('\n').map((line) => line.replace(/\t/, '')).join('\n')
  }

  return (
    <div className={error ? 'action action-actionError' : 'action'}>
      <div
        className={error ? 'action-actionErrorHeader' : 'action-actionHeader'}
        onClick={() => onActionClick(action)}>
        {error ? <i className='icon icon-warning' /> : null}
        {action.isAsync ? <i className='icon icon-asyncAction' /> : null}
        {renderActionTitle()}
      </div>
      {error ? (
        <div className='action-error'>
          <strong>{error.name}</strong> : {error.message}
          <pre data-line={getLineNumber()}>
            <code className='language-javascript' dangerouslySetInnerHTML={{__html: renderCode()}} />
          </pre>
        </div>
      ) : null}
      {!error && execution ? (
        <div>
          <div className='action-actionInput'>
            <div className='action-inputLabel'>Input:</div>
            <div className='action-inputValue'><Inspector value={execution.payload} /></div>
          </div>
          <div className='action-mutations'>
            {execution.data.filter(data => data.type === 'mutation').map((mutation, index) => <Mutation mutation={mutation} key={index} onMutationClick={onMutationClick} />)}
          </div>
          <div className='action-services'>
            {execution.data.filter(data => data.type !== 'mutation').map((service, index) => <Service service={service} key={index} />)}
          </div>
          {execution.output ? (
            <div className='action-actionInput'>
              <div className='action-inputLabel'>Output:</div>
              <div className='action-inputValue'><Inspector value={execution.output} /></div>
            </div>
          ) : null}
          {children}
        </div>
        ) : null}
    </div>
  )
}

export default Action
