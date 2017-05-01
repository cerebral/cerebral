/* global Prism */
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
  const variable = (error.name === 'TypeError') && String(error.message).match(/'(.*?)'/) ? String(error.message).match(/'(.*?)'/)[1] : String(error.message).split(' ')[0]
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
      <span className='action-actionName'>{actionName.name}</span>
      {actionName.params ? <span className='action-actionNameParams'>{actionName.params}</span> : null}
    </div>
  )
}

function renderCode (error) {
  return error.func.split('\n').map((line) => line.replace(/\t/, '')).join('\n')
}

class Action extends Inferno.Component {
  constructor (props) {
    super(props)
    this.isHighlighted = false
  }
  componentDidMount () {
    if (this.errorElement) {
      Prism.highlightElement(this.errorElement)
      this.isHighlighted = true
    }
  }
  componentDidUpdate () {
    // Inferno hack, this triggers too early
    setTimeout(() => {
      if (this.errorElement && !this.isHighlighted) {
        Prism.highlightElement(this.errorElement)
        this.isHighlighted = true
      }
    })
  }
  render () {
    const {action, faded, execution, children, onMutationClick, executed} = this.props

    const error = execution && execution.error
    const titleClassname = classnames({
      'action-actionErrorHeader': error,
      'action-actionHeader': !error,
      'action-faded': faded
    })
    return (
      <div
        className={error ? 'action action-actionError' : 'action'}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={titleClassname}>
          {error && <i className='icon icon-warning' />}
          {action.isAsync && <i className='icon icon-asyncAction' />}
          {renderActionTitle(action)}
        </div>
        {error ? (
          <div className='action-error'>
            <div className='action-actionInput'>
              <div className='action-inputLabel'>props:</div>
              <div className='action-inputValue'><Inspector value={execution.payload} /></div>
            </div>
            <div className='action-error-message'>
              <strong>{error.name}:</strong> <Inspector value={error.message} />
            </div>
            <pre data-line={getLineNumber(error) || null}>
              <code
                ref={(node) => { this.errorElement = node }}
                className='language-javascript'
                dangerouslySetInnerHTML={{__html: renderCode(error)}} />
            </pre>
            {executed}
          </div>
        ) : null}
        {!error && execution ? (
          <div>
            <div className={faded ? 'action-faded' : null}>
              <div className='action-actionInput'>
                <div className='action-inputLabel'>props:</div>
                <div className='action-inputValue'><Inspector value={execution.payload} /></div>
              </div>
              <div className='action-mutations'>
                {execution.data.filter(data => data.type === 'mutation').map((mutation, index) => <Mutation mutation={mutation} key={index} onMutationClick={onMutationClick} />)}
              </div>
              <div className='action-services'>
                {execution.data.filter(data => data.type !== 'mutation').map((service, index) => <Service service={service} key={index} />)}
              </div>
              {executed}
              {execution.output && (
                <div className='action-actionInput'>
                  <div className='action-inputLabel'>output:</div>
                  <div className='action-inputValue'><Inspector value={execution.output} /></div>
                </div>
              )}
            </div>
            {children}
          </div>
          ) : null}
      </div>
    )
  }
}

export default Action
