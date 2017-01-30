import './styles.css'
import Inferno from 'inferno' // eslint-disable-line

import Inspector from '../../../Inspector'
import Mutation from './Mutation'
import Service from './Service'
import classnames from 'classnames'

function getActionName (action) {
  var regex = /\(([^()]+)\)/
  var match = regex.exec(action.name)

  return {
    name: match ? action.name.substr(0, match.index).trim() : action.name.trim(),
    params: match ? match[1] : null
  }
}

function getLineNumber (error) {
  const variable = error.name === 'TypeError' && error.message.match(/'(.*?)'/) ? error.message.match(/'(.*?)'/)[1] : error.message.split(' ')[0]
  const lines = error.func.split('\n')

  return lines.reduce((lineNumber, line, index) => {
    if (lineNumber === -1 && line.indexOf(variable) >= 0) {
      return index + 2
    }
    return lineNumber
  }, -1)
}

function renderActionTitle (action) {
  const actionName = getActionName(action)
  return (
    <div className='action-actionTitle'>
      {actionName.name}
      {actionName.params ? <span className='action-actionNameParams'>{actionName.params}</span> : null}
    </div>
  )
}

function renderCode (error) {
  return error.func.split('\n').map((line) => line.replace(/\t/, '')).join('\n')
}

function Action ({action, faded, execution, children, onMutationClick, onActionClick}) {
  const error = execution && execution.error
  const titleClassname = classnames({
    'action-actionError': error,
    'action-actionHeader': !error,
    'action-faded': faded
  })
  return (
    <div className={error ? 'action action-actionError' : 'action'}>
      <div
        className={titleClassname}
        onClick={() => onActionClick(action)}>
        {error ? <i className='icon icon-warning' /> : null}
        {action.isAsync ? <i className='icon icon-asyncAction' /> : null}
        {renderActionTitle(action)}
      </div>
      {error ? (
        <div className='action-error'>
          <strong>{error.name}</strong> : {error.message}
          <pre data-line={getLineNumber(error)}>
            <code className='language-javascript' dangerouslySetInnerHTML={{__html: renderCode(error)}} />
          </pre>
        </div>
      ) : null}
      {!error && execution ? (
        <div>
          <div className={faded ? 'action-faded' : null}>
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
          </div>
          {children}
        </div>
        ) : null}
    </div>
  )
}

export default Action
