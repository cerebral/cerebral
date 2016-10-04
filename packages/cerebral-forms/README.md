# cerebral-forms
Signals, actions and state factories to create forms

## API

### form
A state factory for creating form state. Used when defining initial state or dynamically with an action. You can put forms inside forms.

```js
import {form} from 'cerebral-form'

export default {
  state: {
    form: form({
      firstName: {
        value: ''
      },
      lastName: {
        value: ''
      }
    })
  }
}
```

```js
import {form} from 'cerebral-form'

export default function MyAction({state}) {
  state.set('some.new.form', form({
    name: {
      value: ''
    },
    age: {
      value: 18
    }
  }))
}
```

### field
A Field factory for creating a field. Used when adding new fields dynamically to an existing form.

```js
import {field} from 'cerebral-form'

export default function MyAction({state}) {
  state.set('path.to.form.address2', field({
    value: ''
  }))
}
```

### changeField
A **chain** you can use to easily change a field in some form. It will automatically validate the form. Can also be composed into any other chain.

```js
import {changeField} from 'cerebral-form'

export default {
  state: {
    form: Form({
      firstName: {
        value: ''
      }
    })
  },
  signals: {
    fieldChanged: changeField
  }
}
```

In your view code you call the signal with path to the field and the updated value:

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  form: 'someModule.form'
}, {
  fieldChanged: 'someModule.fieldChanged'
},
  function MyForm({form, fieldChanged}) {
    return (
      <div>
        <h4>First name</h4>
        <input
          value={form.firstName.value}
          onChange={(event) => fieldChanged({
            path: 'someModule.firstName',
            value: event.target.value
          })}
          />
      </div>
    )
  }
)
```

### validateField
An **action** factory you can use to validate any field in any chain.

```js
import {validateField} from 'cerebral-form'

export default [
  doThis,
  validateField('path.to.form.field'),
  doThat
]
```

In your view code you call the signal with path to the field and the updated value:

```js
import React from 'react'
import {connect} from 'cerebral/react'

export default connect({
  form: 'someModule.form'
}, {
  fieldChanged: 'someModule.fieldChanged'
},
  function MyForm({form, fieldChanged}) {
    return (
      <div>
        <h4>First name</h4>
        <input
          value={form.firstName.value}
          onChange={(event) => fieldChanged({
            path: 'someModule.firstName',
            value: event.target.value
          })}
          />
      </div>
    )
  }
)
```

### resetForm
An **action** factory you can use to reset any form from any chain. It will replace current value with the initial or default value defined. And revalidate.

```js
import {resetForm} from 'cerebral-form'

export default [
  doThis,
  resetForm('path.to.form'),
  doThat
]
```

### formToJSON
A function that takes a form and returns the same structure with only values. Can be used wherever, though typically in actions. Often used to pass a form to server.

```js
import {formToJSON} from 'cerebral-form'

export default function MyAction({state, axios}) {
  const formData = formToJSON(state.get('some.form'))

  return axios.post('/data', formData)
}
```

### getFormFields
A function that takes a form and returns an object where the key is the path to the field and the value is the field itself. Typically used to calculate the state of a form.

This examples is a function that takes a form and returns true if all fields has a value.

```js
import {getFormFields} from 'cerebral-forms'

export default function allHasValue(form) {
  const formFields = getFormFields(form)

  return Object.keys(formFields).reduce((allHasValue, key) => {
    if (!allHasValue || !formFields[key].hasValue) {
      return false
    }
    return true
  }, true)
}
```

### getInvalidFormFields
A function that takes a form and returns only the fields that are invalid. The object keys are the path to the field and the value is the field itself.

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {getInvalidFormFields} from 'cerebral-forms'

export default connect({
  form: 'someModule.form'
},
  function MyForm({form}) {
    const invalidFields = getInvalidFormFields(form)

    return (
      <ul>
        {Object.keys(invalidFields).map((key) => (
          <li key={key}>
            {invalidFields[key].errorMessage}
          </li>
        ))}
      </ul>
    )
  }
)
```

### isValidForm
A function that takes a form and returns true if all the fields in the form is valid. Used in both actions and components.

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {isValidForm} from 'cerebral-forms'

export default connect({
  form: 'someModule.form'
},
  function MyForm({form}) {
    const isValid = isValidForm(form)

    return (
      <div>
        <button disabled={!isValid}>Send form</button>
      </div>
    )
  }
)
```

### Rules

- **isValue** - Checks if there is a truthy value, including array length
- **isExisty** - Checks for truthy value
- **matchRegexp** - Only in object form: [{matchRegexp: /\s/g}]
- **isUndefined** - Checks if undefined
- **isEmpyString** - Checks if empty string
- **isEmail** - Checks if valid email format
- **isUrl** - Checks if valid url format
- **isTrue** - Checks if actual true value
- **isFalse** - Checks if actual false value
- **isNumeric** - Checks value is only numeric
- **isAlpha** - Checks if value is only alpha characters (text)
- **isAlphanumeric** - Checks if either numeric or alpha characters
- **isInt** - Checks if value is number and no decimals
- **isFloat** - Checks if value is number with decimals
- **isWords** - Checks if multiple words in value
- **isSpecialWords** - Checks for special characters in words
- **isLength:Number** - Checks length of value with number passed
- **equals:Value** - Does strict equality check
- **equalsField:Field** - Checks equality of field in same form
- **maxLength:Number** - Checks value length does not pass passed number
- **minLength:Number** - Checks value length does pass passed number
