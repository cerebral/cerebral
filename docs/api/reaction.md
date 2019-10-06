# Reaction

You will typically use reactions with your components, for example:

```js
import * as React from 'react'
import { connect } from '@cerebral/react'
import { state, sequences } from 'cerebral'

export default connect(
  {
    inputValue: state`inputValue`,
    changeInputValue: sequences`changeInputValue`
  },
  class MyComponent extends React.Component {
    componentDidMount() {
      this.props.reaction(
        'focusUsername',
        {
          error: state`usernameError`
        },
        ({ error }) => error && this.input.focus()
      )
    }
    render() {
      return (
        <input
          ref={(node) => {
            this.input = node
          }}
          value={this.props.inputValue}
          onChange={(event) =>
            this.props.changeInputValue({ value: event.target.value })
          }
        />
      )
    }
  }
)
```