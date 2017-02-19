import './styles.css'
import Inferno from 'inferno'
import {connect} from 'cerebral/inferno'
import {
  isObject,
  isArray
} from '../../../../common/utils'

export default connect({},
  class JSONInput extends Inferno.Component {
    constructor (props) {
      super(props)
      this.state = {
        isValid: true,
        value: this.props.value,
        initialValue: this.props.value
      }
      this.onChange = this.onChange.bind(this)
      this.onSubmit = this.onSubmit.bind(this)
    }
    componentDidMount (prevProps, prevState) {
      this.input.select()
    }
    onChange (event) {
      let value = event.target.value
      let isValid = true
      let parsedValue = value

      try {
        parsedValue = JSON.parse(value)
      } catch (e) {
        isValid = !!value.length
      }

      if (isObject(parsedValue) || isArray(parsedValue)) {
        return
      } else {
        value = parsedValue
      }

      this.setState({
        value,
        isValid
      })
    }
    onBlur () {
      this.setState({
        value: this.state.initialValue
      })
      this.props.onBlur()
    }
    onSubmit (event) {
      event.preventDefault()
      this.props.onSubmit(this.state.value)
    }
    render () {
      return (
        <form style={{display: 'inline'}} onSubmit={this.onSubmit}>
          <input
            ref={(node) => { this.input = node }}
            type='Text'
            autoFocus
            onKeyDown={(event) => { event.keyCode === 27 && this.onBlur() }}
            className={this.state.isValid ? 'JSONinput-input' : 'JSONinput-input JSONinput-invalidInput'}
            value={String(this.state.value)}
            onInput={this.onChange}
            onBlur={() => this.onBlur()}
            />
        </form>
      )
    }
  }
)
