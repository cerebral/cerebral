# cerebral-provider-forms

## install
`npm install cerebral-provider-forms@next --save --save-exact`

## description
The forms provider allows you to easily compute forms based on a number of rules. Easily add new rules, error messages and, if you want, add whatever you want to your fields for custom logic.

## instantiate

```javascript
import {Controller} from 'cerebral'
import FormsProvider from 'cerebral-provider-forms'

const controller = Controller({
  providers: [
    FormsProvider({
      // Add additional rules
      rules: {
        myAddedRule (value, form, args) {
          value // value of the field
          form // the form field is attached to
          args // arg(s) passed to the rule

          return true
        }
      },

      // errorMessage property added to field when invalid with the following rules
      errorMessages: {
        minLength (value, minLength) {
          return `The length is ${value.length}, should be equal or more than ${minLength}`
        }
      }
    })
  ]
})
```

## form
A form is just an object in the state tree:

```js
{
  myForm: {}
}
```

## field
A field is just an object with a `value` property:

```js
{
  myForm: {
    myField: {
      value: ''
    }
  }
}
```

## nesting
You can nest this however you want, even with array:

```js
{
  myForm: {
    firstName: {value: ''},
    lastName: {value: ''},
    address: [{
      street: {value: ''},
      zipCode: {value: ''}
    }],
    interests: {
      books: {value: false},
      films: {value: false}
    }
  }
}
```

## compute
To use a form you use the **form** computed, pointing to the form. Typically:

```js
import React from 'react'
import {connect} from 'cerebral/react'
import {form} from 'cerebral-provider-forms'

export default connect({
  form: form(state`path.to.form`)
},
  function MyForm ({form}) {
    // Value of some field
    form.someField.value
    // A true/false if field has a value
    form.someField.hasValue
    // A true/false if field has been changed
    form.someField.isPristine
    // A true/false if field is valid
    form.someField.isValid
    // The index of the validation rule that failed. Use it
    // to map to text resources
    form.someField.failedRuleIndex
    // If you have defined global error messages and field is invalid
    form.someField.errorMessage
  }
)
```

## provider
You can also access your forms in actions.

```js
function myAction ({forms}) {
  const form = forms.get('path.to.form')
}
```

### toJSON
Typically you want to convert your forms to a plain value structure.

```js
function myAction ({forms}) {
  const form = forms.toJSON('path.to.form')
}
```

This form will now have the structure of:

```js
{
  myField: 'theValue',
  address: {
    street: 'street value',
    zipCode: 'zip code value'
  }
}
```

### reset
Reset the form to its default values (or empty string by default).

```js
function myAction ({forms}) {
  forms.reset('path.to.form')
}
```

### updateRules
Dynamically update available rules:

```js
function myAction ({forms}) {
  forms.updateRules({
    someNewRule () {}
  })
}
```

### updateRules
Dynamically update global error messages:

```js
function myAction ({forms}) {
  forms.updateErrorMessages({
    someRule () {}
  })
}
```

## validationRules
You add validation rules on the field:

```js
{
  myForm: {
    // Define rules using a string
    firstName: {
      value: '',
      validationRules: ['minLength:3']
    },
    // Define rules using an object. Allows you to compose
    // multiple rules into one
    lastName: {
      value: '',
      validationRules: [{
        minLength: 3,
        maxLength: 6
      }]
    }
  }
}
```

## defaultValue
You can define a default value for your fields. When the form is **reset**, it will put back the default value:

```js
{
  myForm: {
    firstName: {
      value: '',
      defaultValue: 'Ben'
    }
  }
}
```

## isRequired
Define field as required. This will make the field invalid if there is no value. By default forms identifies a value or not
using the **isValue** rule. You can change this rule if you want, look below.

```js
{
  myForm: {
    firstName: {
      value: '',
      isRequired: true
    }
  }
}
```

## isValueRules
You can change what defines a field as having a value. For example if your value is an array, you can use the **minLength** rule to
define a required minimum of 3 items in the array.

```js
{
  myForm: {
    interests: {
      value: [],
      isRequired: true,
      isValueRules: ['minLength:3']
    }
  }
}
```

## operators

### setField
When you change the value of a field you will need to use this operator. Note that you point to the field, not the field value.

```js
import {state, props} from 'cerebral/tags'
import {setField} from 'cerebral-provider-forms/operators'

export default [
  setField(state`my.form.field`, props`value`)
]
```

### isValidForm
Diverge execution based on validity of a form.

```js
import {state} from 'cerebral/tags'
import {isValidForm} from 'cerebral-provider-forms/operators'

export default [
  isValidForm(state`my.form`) {
    true: [],
    false: []
  }
]
```

### resetForm
Reset a form.

```js
import {state} from 'cerebral/tags'
import {resetForm} from 'cerebral-provider-forms/operators'

export default [
  resetForm(state`my.form`)
]
```
