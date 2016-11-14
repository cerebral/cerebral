import React from 'react'
import styles from './styles.css'
import icons from '../../../../../../../common/icons.css'
import classnames from 'classnames'

import Inspector from '../../../Inspector'
import Mutation from './Mutation'
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
      <div className={styles.actionTitle}>
        {actionName.name}
        {actionName.params ? <span className={styles.actionNameParams}>{actionName.params}</span> : null}
      </div>
    )
  }

  const className = classnames({
    [icons.asyncAction]: action.isAsync,
    [icons.action]: !action.isAsync && action.hasExecuted,
    [icons.skippedOutput]: !action.hasExecuted,
    spin: action.isExecuting,
    [icons.runningAction]: action.isExecuting
  })

  return (
    <div className={action.error ? styles.actionError : styles.action}>
      <div
        className={action.error ? styles.actionErrorHeader : styles.actionHeader}
        onClick={() => onActionClick(action)}>
        {action.error ? <i className={icons.warning} /> : null}
        {action.isAsync ? <i className={icons.asyncAction} /> : null}
        {renderActionTitle()}
      </div>
      {action.error ? (
        <div className={styles.error}>
          <strong>{action.error.name}</strong> : {action.error.message}
          <pre data-line={getLineNumber()}>
            <code className='language-javascript' dangerouslySetInnerHTML={{__html: action.error.stack.split('\n').filter((line) => line.trim() !== '').join('\n')}} /></pre>
        </div>
      ) : null}
      {!action.error && execution ? (
        <div>
          <div className={styles.actionInput}>
            <i className={icons.down} />
            <div className={styles.inputLabel}>Input:</div>
            <div className={styles.inputValue}><Inspector value={execution.payload} /></div>
          </div>
          <div className={styles.mutations}>
            {execution.data.filter(data => data.type === 'mutation').map((mutation, index) => <Mutation mutation={mutation} key={index} onMutationClick={onMutationClick} />)}
          </div>
          <div className={styles.services}>
            {execution.data.filter(data => data.type !== 'mutation').map((service, index) => <Service service={service} key={index} />)}
          </div>
          {children}
        </div>
        ) : null}
    </div>

  )
}

export default Action
