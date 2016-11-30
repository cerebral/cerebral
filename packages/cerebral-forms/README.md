# cerebral-forms
Signals, actions and state factories to create forms

## Install
This project is still in alpha. To test alpha version check [instructions in monorepo](https://github.com/cerebral/cerebral/blob/master/README.md).

## API
Cerebral forms is basically a function that creates state needed to handle validation and an action factory for validating fields. It is simple in nature, but handles all the complexity that comes with forms.

### form
A state factory for creating form state. Used when defining initial state or dynamically with an action. You can put forms inside forms.

You can add any properties to a form where properties containing an object with a "value" property are identified as fields.

```js
import {form} from 'cerebral-forms'

export default {
  state: {
    form: form({
      firstName: {
        // The initial value
        value: '',
        // Validation rules with name and arguments passed in
        // with colon separation
        validationRules: ['minLength:3'],
        // Error messages mapped to same index as validation rule
        validationMessages: ['Must be at least 3 characters long'],
        // When setting isRequired to true the field will be invalid if there
        // is no value. To determine if there is not value, check "isValueRules" below
        isRequired: false,
        // Error message when field is required but has no value
        requiredMessage: null,
        // Will only be valid if this other field is also valid.
        // Point to a field in the model
        dependsOn: 'app.myForm.repeatPassword'
        // You could also add an array to dependsOn to support multiple depends
        // dependsOn: ['app.myForm.repeatPassword', 'app.someOtherForm.someField']

        // Some properties are default and rarely changed, but you
        // are free to change them

        // Set the rules for identifying a value being present. Used
        // in combination with "isRequired" when field is validating
        isValueRules: ['isValue'],
        // Value will be copied, but you can change it. Will be set
        // when using form reset
        defaultValue: '',

        // Some properties are created for you, set when validation runs
        // and you can use them in components. You can also set these
        // properties manually, though usually the validate action factory
        // is used to handle this

        // Toggled when field is validated
        hasValue: false,
        // If field has been validated or not. Toggled when validated
        isPristine: true,
        // Toggled when field is validated
        isValid: true,
        // Current error message, set when field is validated
        errorMessage: null,
      },
      lastName: {
        value: '',
        // Combine rules using an object
        validationRules: [{
          minLength: 3,
          isAlpha: true
        }]
      }
    })
  }
}
```

Sometimes you want more control over your form. ``` isPristine ``` for example changes from false to true whenever you do a validation on the field. Sometimes you might want blur events instead to show error messages to the user. You are completely free to add whatever state you need when you create your fields. An isTouched property might be used to make blur events but you can call it whatever you like, it's just state.


```js
import {form} from 'cerebral-forms'

export default function MyAction({state}) {
  state.set('some.new.form', form({
    name: {
      value: '',
      isTouched: false // change this field onBlur to have more control over error messages
    },
    age: {
      value: 18
    }
  }))
}
```

#### Set a default value for the whole form
You can set a default value for a property using a factory:
```js
import {form, getFormFields} from 'cerebral-forms'

const MyFormFactory = (formObject) => {
  const myForm = form(formObject)
  const fields = getFormFields(myForm)

  // You can also set some special properties for the whole form
  newForm.showErrors = false

  fields.forEach((field) => {
    field.requiredMessage = field.requiredMessage || 'This field is required'
    field.someProp = field.someProp || 'Some default'
  })

  return myForm
}

```

#### Custom global props
You can add custom props to the root to the form state.

For example if you want to show validation errors only
when submitting the form you can add a `showErrors` prop
which you set true when validation fails during form submit.

```js
import {form} from 'cerebral-forms'

export default function MyAction({state}) {
  state.set('some.new.form', form({
    name: {
      value: '',
    },
    showErrors: false
  }))
}
```

### field
To add a new field you simply merge a new form into the existing one.

```js
import {form} from 'cerebral-forms'

export default function MyAction({state}) {
  state.merge('path.to.form', form({
    address2: {
      value: ''
    }
  }))
}
```

### changeField
A **chain** you can use to easily change a field in some form. It will automatically validate the form. Can also be composed into any other chain.

```js
import {changeField} from 'cerebral-forms'

export default {
  state: {
    form: form({
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
            field: 'someModule.form.firstName',
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
import {input} from 'cerebral/operators'
import {validateField} from 'cerebral-forms'

export default [
  doThis,
  // static
  validateField('path.to.form.field'),
  // dynamic
  validateField(input`fieldPath`),
  doThat
]
```

### validateForm
An **action** factory you can use to validate a whole form.

```js
import {input} from 'cerebral/operators'
import {validateForm} from 'cerebral-forms'

export default [
  // static
  validateForm('path.to.form'),
  // dynamic
  validateForm(input`formPath`),
  isFormValid, {
    true: [
      passInForm
    ],
    false: [
      setSomeErrorMessages
    ]
  }
]
```


### initializeForm
An **action** factory you can use to initialize any form via initialValues from any chain. It will replace current value with the initialValues value or default value defined. And revalidate.

```js
import {input} from 'cerebral/operators'
import {initializeForm} from 'cerebral-forms'

const initialValues = {
  name: 'Mike',
  age: 18
}

export default [
  doThis,
  // static
  initializeForm('path.to.form', initialValues),
  // dynamic
  initializeForm(input`formPath`, input`initialValuesPath`),
  doThat
]
```


### resetForm
An **action** factory you can use to reset any form from any chain. It will replace current value with the initial or default value defined. And revalidate.

```js
import {input} from 'cerebral/operators'
import {resetForm} from 'cerebral-forms'

export default [
  doThis,
  // static
  resetForm('path.to.form'),
  // dynamic
  resetForm(input`formPath`),
  doThat
]
```

### formToJSON
A function that takes a form and returns the same structure with only values. Can be used wherever, though typically in actions. Often used to pass a form to server.

```js
import {formToJSON} from 'cerebral-forms'

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

You can also use this function inside a chain:

```js
import {input} from 'cerebral/operators'
import {isValidForm} from 'cerebral-forms'

export default [
  // static
  isValidForm('path.to.form')
  // dynamic
  isValidForm(input`formPath`), {
    true: [],
    false: []
  }
]
```

### Rules

- **isValue** - Checks if there is a truthy value, including array length
- **isExisty** - Checks for truthy value
- **matchRegexp** - Only in object form: [{matchRegexp: /\s/g}]
- **isUndefined** - Checks if undefined
- **isEmpty** - Checks if empty string
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

### Custom rules
You can attach new rules to the rules object.

```js
import {rules} from 'cerebral-forms';

// You get passed the value of the field,
// the form it is attached to and whatever
// arg you pass after : (minLength:3)
rules.isFirstUpperCase = (value, form, arg) => {
  return typeof value === 'string' && value[0] === value[0].toUpperCase()
}
```
