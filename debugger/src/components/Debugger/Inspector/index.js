import './styles.css'
import Inferno from 'inferno'

import {
  isObject,
  isArray,
  isString,
  isBoolean,
  isNumber,
  isNull
} from '../../../common/utils'
import JSONInput from './JSONInput'
import connector from 'connector'

function isInPath (source, target) {
  if (!source || !target) {
    return false
  }
  return target.reduce((isInPath, key, index) => {
    if (!isInPath) {
      return false
    }
    return String(source[index]) === String(key)
  }, true)
}

function renderType (value, hasNext, path, propertyKey, highlightPath, modelChanged) {
  if (value === undefined) {
    return null
  }

  if (isArray(value)) {
    return (
      <ArrayValue
        value={value}
        hasNext={hasNext}
        modelChanged={modelChanged}
        path={path}
        propertyKey={propertyKey}
        highlightPath={highlightPath} />
    )
  }
  if (isObject(value)) {
    return (
      <ObjectValue
        value={value}
        hasNext={hasNext}
        modelChanged={modelChanged}
        path={path}
        propertyKey={propertyKey}
        highlightPath={highlightPath} />
    )
  }

  return (
    <Value
      value={value}
      hasNext={hasNext}
      path={path}
      modelChanged={modelChanged}
      propertyKey={propertyKey}
      highlightPath={highlightPath} />
  )
}

class ObjectValue extends Inferno.Component {
  constructor (props, context) {
    super(props)
    const numberOfKeys = Object.keys(props.value).length
    const isHighlightPath = !!(this.props.highlightPath && isInPath(this.props.highlightPath, this.props.path))
    const preventCollapse = this.props.path.length === 0 && context.options.expanded

    this.state = {
      isCollapsed: (
        !preventCollapse && !isHighlightPath &&
        (numberOfKeys > 3 || numberOfKeys === 0 ? true : !context.options.expanded)
      )
    }

    this.onCollapseClick = this.onCollapseClick.bind(this)
    this.onExpandClick = this.onExpandClick.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    const context = this.context
    const props = nextProps
    const numberOfKeys = Object.keys(props.value).length
    const isHighlightPath = !!(props.highlightPath && isInPath(props.highlightPath, props.path))
    const preventCollapse = props.path.length === 0 && context.options.expanded

    if (this.state.isCollapsed) {
      this.setState({
        isCollapsed: (
          !preventCollapse && !isHighlightPath &&
          (numberOfKeys > 3 || numberOfKeys === 0 ? true : !context.options.expanded)
        )
      })
    }
  }
  componentDidUpdate (prevProps) {
    if (String(this.props.highlightPath) === String(this.props.path)) {
      document.querySelector('#model').scrollTop = this.node.offsetTop - 100
    }
  }
  onExpandClick (event) {
    event.stopPropagation()
    this.setState({isCollapsed: false})
  }
  onCollapseClick (event) {
    event.stopPropagation()
    this.setState({isCollapsed: true})
  }
  renderProperty (key, value, index, hasNext, path) {
    this.props.path.push(key)
    const property = (
      <div className='inspector-objectProperty' key={index}>
        <div className='inspector-bjectPropertyValue'>{renderType(value, hasNext, path.slice(), key, this.props.highlightPath, this.props.modelChanged)}</div>
      </div>
    )
    this.props.path.pop()
    return property
  }
  renderKeys (keys) {
    if (keys.length > 3) {
      return keys.slice(0, 3).join(', ') + '...'
    }
    return keys.join(', ')
  }
  render () {
    const {value, hasNext} = this.props
    const isExactHighlightPath = this.props.highlightPath && String(this.props.highlightPath) === String(this.props.path)

    if (this.state.isCollapsed) {
      return (
        <div ref={(node) => { this.node = node }} className={isExactHighlightPath ? 'inspector-object inspector-highlight' : 'inspector-object'} onClick={this.onExpandClick}>
          {this.props.propertyKey ? this.props.propertyKey + ': ' : null}
          <strong>{'{ '}</strong>{this.renderKeys(Object.keys(value))}<strong>{' }'}</strong>
          {hasNext ? ',' : null}
        </div>
      )
    } else if (this.props.propertyKey) {
      const keys = Object.keys(value)
      return (
        <div ref={(node) => { this.node = node }} className={isExactHighlightPath ? 'inspector-object inspector-highlight' : 'inspector-object'}>
          <div onClick={this.onCollapseClick}>{this.props.propertyKey}: <strong>{'{ '}</strong></div>
          {keys.map((key, index) => this.renderProperty(key, value[key], index, index < keys.length - 1, this.props.path))}
          <div><strong>{' }'}</strong>{hasNext ? ',' : null}</div>
        </div>
      )
    } else {
      const keys = Object.keys(value)
      return (
        <div ref={(node) => { this.node = node }} className={isExactHighlightPath ? 'inspector-object inspector-highlight' : 'inspector-object'}>
          <div onClick={this.onCollapseClick}><strong>{'{ '}</strong></div>
          {keys.map((key, index) => this.renderProperty(key, value[key], index, index < keys.length - 1, this.props.path, this.props.highlightPath))}
          <div><strong>{' }'}</strong>{hasNext ? ',' : null}</div>
        </div>
      )
    }
  }
}

class ArrayValue extends Inferno.Component {
  constructor (props, context) {
    super(props)
    const numberOfItems = props.value.length
    const isHighlightPath = this.props.highlightPath && isInPath(this.props.highlightPath, this.props.path)
    this.state = {
      isCollapsed: (
        !isHighlightPath &&
        (numberOfItems > 3 || numberOfItems === 0) ? true : !context.options.expanded
      )
    }
    this.onCollapseClick = this.onCollapseClick.bind(this)
    this.onExpandClick = this.onExpandClick.bind(this)
  }
  componentWillReceiveProps (nextProps) {
    const context = this.context
    const props = nextProps
    const numberOfItems = props.value.length
    const isHighlightPath = props.highlightPath && isInPath(props.highlightPath, props.path)
    if (this.state.isCollapsed) {
      this.setState({
        isCollapsed: (
          !isHighlightPath &&
          (numberOfItems > 3 || numberOfItems === 0) ? true : !context.options.expanded
        )
      })
    }
  }
  componentDidUpdate () {
    if (String(this.props.highlightPath) === String(this.props.path)) {
      document.querySelector('#model').scrollTop = this.node.offsetTop - 100
    }
  }
  onExpandClick (event) {
    event.stopPropagation()
    this.setState({isCollapsed: false})
  }
  onCollapseClick (event) {
    event.stopPropagation()
    this.setState({isCollapsed: true})
  }
  renderItem (item, index, hasNext, path) {
    this.props.path.push(index)
    const arrayItem = (
      <div className='inspector-arrayItem' key={index}>
        {renderType(item, hasNext, path.slice(), null, this.props.highlightPath, this.props.modelChanged)}
      </div>
    )
    this.props.path.pop()
    return arrayItem
  }
  render () {
    const {value, hasNext} = this.props
    const isExactHighlightPath = this.props.highlightPath && String(this.props.highlightPath) === String(this.props.path)

    if (this.state.isCollapsed) {
      return (
        <div className={isExactHighlightPath ? 'inspector-array inspector-highlight' : 'inspector-array'} onClick={this.onExpandClick}>
          {this.props.propertyKey ? this.props.propertyKey + ': ' : null}
          <strong>{'[ '}</strong>{value.length}<strong>{' ]'}</strong>
          {hasNext ? ',' : null}
        </div>
      )
    } else if (this.props.propertyKey) {
      return (
        <div ref={(node) => { this.node = node }} className={isExactHighlightPath ? 'inspector-array inspector-highlight' : 'inspector-array'}>
          <div onClick={this.onCollapseClick}>{this.props.propertyKey}: <strong>{'[ '}</strong></div>
          {value.map((item, index) => this.renderItem(item, index, index < value.length - 1, this.props.path))}
          <div><strong>{' ]'}</strong>{hasNext ? ',' : null}</div>
        </div>
      )
    } else {
      return (
        <div ref={(node) => { this.node = node }} className={isExactHighlightPath ? 'inspector-array inspector-highlight' : 'inspector-array'}>
          <div onClick={this.onCollapseClick}><strong>{'[ '}</strong></div>
          {value.map((item, index) => this.renderItem(item, index, index < value.length - 1, this.props.path))}
          <div><strong>{' ]'}</strong>{hasNext ? ',' : null}</div>
        </div>
      )
    }
  }
}

class Value extends Inferno.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      path: props.path.slice()
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onClick = this.onClick.bind(this)
  }
  componentDidUpdate () {
    if (String(this.props.highlightPath) === String(this.props.path)) {
      document.querySelector('#model').scrollTop = this.node.offsetTop - 100
    }
  }
  onClick () {
    this.setState({
      isEditing: !!this.context.options.canEdit
    })
  }
  onSubmit (value) {
    this.props.modelChanged({
      path: this.state.path,
      value
    })
    this.setState({isEditing: false})

    connector.sendEvent('changeModel', {
      path: this.state.path,
      value: value
    })
  }
  onBlur () {
    this.setState({isEditing: false})
  }
  shortenString (string) {
    if (string.length > 50) {
      return string.substr(0, 47) + '...'
    }

    return string
  }
  renderValue (value, hasNext) {
    const isExactHighlightPath = this.props.highlightPath && String(this.props.highlightPath) === String(this.props.path)

    if (this.state.isEditing) {
      return (
        <div className={isExactHighlightPath ? 'inspector-highlight' : null}>
          {this.props.propertyKey ? this.props.propertyKey + ': ' : <span />}
          <span>
            <JSONInput
              value={value}
              onBlur={this.onBlur}
              onSubmit={this.onSubmit} />
          </span>
          {hasNext ? ',' : null}
        </div>
      )
    } else {
      return (
        <div className={isExactHighlightPath ? 'inspector-highlight' : null}>
          {this.props.propertyKey ? this.props.propertyKey + ': ' : <span />}
          <span onClick={this.onClick}>{isString(value) ? '"' + this.shortenString(value) + '"' : String(value)}</span>
          {hasNext ? ',' : null}
        </div>
      )
    }
  }
  render () {
    let className = 'inspector-string'
    if (isNumber(this.props.value)) className = 'inspector-number'
    if (isBoolean(this.props.value)) className = 'inspector-boolean'
    if (isNull(this.props.value)) className = 'inspector-null'
    return (
      <div ref={(node) => { this.node = node }} className={className}>
        {this.renderValue(this.props.value, this.props.hasNext)}
      </div>
    )
  }
}

class Inspector extends Inferno.Component {
  getChildContext () {
    return {
      options: {
        expanded: this.props.expanded || false,
        canEdit: this.props.canEdit || false
      }
    }
  }
  render () {
    return renderType(this.props.value, false, [], null, this.props.path, this.props.modelChanged)
  }
}

export default Inspector
