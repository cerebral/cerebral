# @cerebral/forms

## Install

**NPM**

`npm install @cerebral/forms`

## Description

Forms are one of the most complex state management challenges out there. Before Cerebral was created I spent a lot of time developing [formsy-react](https://github.com/formsy/formsy-react), which is a library that tries to solve forms with internal state. With the release of Cerebral we got a chance to explore the space of solving forms complexity with external state instead. To this day I have a hard time recommending a solution and you should **not** see this addon as "the official way of managing forms with Cerebral". There is nothing wrong thinking of a form as a very complex input where you only pass data into Cerebral on the submit of the form.

## Instantiate

```javascript
import { Controller } from 'cerebral'
import FormsProvider from '@cerebral/forms'

const controller = Controller({
  providers: [
    FormsProvider({
      // Add additional rules
      rules: {
        myAddedRule(value, arg, get) {
          // value of the field
          value
          // arg passed to the rule
          arg
          // The "get" argument from computed. Use it to grab
          // state or props passed to component. The component
          // will track use of these dependencies for rerender
          get

          return true
        }
      },

      // errorMessage property added to field when invalid with the following rules
      errorMessages: {
        minLength(value, minLength) {
          return `The length is ${
            value.length
          }, should be equal or more than ${minLength}`
        }
      }
    })
  ]
})
```

## compute

To use a form you use the **form** computed, pointing to the form. Typically:

```js
import React from 'react'
import { connect } from '@cerebral/react'
import { form } from '@cerebral/forms'

export default connect(
  {
    form: form(state`path.to.form`)
  },
  function MyForm({ form }) {
    // Value of some field
    form.someField.value
    // A true/false if field has a value
    form.someField.hasValue
    // A true/false if field has been changed
    form.someField.isPristine
    // A true/false if field is valid
    form.someField.isValid
    // The name of the rule that failed
    form.someField.failedRule.name
    // Any arg you passed to the failing rule
    form.someField.failedRule.arg
    // If you have defined global error messages and field is invalid
    form.someField.errorMessage
    // Get all invalid fields
    form.getInvalidFields()
    // Get all fields
    form.getFields()
  }
)
```

You can also use the **field** computed, pointing to the field. This will optimize rendering as only the field will render on change.

```js
import React from 'react'
import { connect } from '@cerebral/react'
import { field } from '@cerebral/forms'

export default connect(
  {
    field: field(state`path.to.form.name`)
  },
  function MyField({ field }) {
    // Value of some field
    field.value
    // A true/false if field has a value
    field.hasValue
    // A true/false if field has been changed
    field.isPristine
    // A true/false if field is valid
    field.isValid
  }
)
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

## form

A form is just an object in the state tree:

```js
{
  myForm: {
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

## operators

### isValidForm

Diverge execution based on validity of a form.

```js
import { state } from 'cerebral/tags'
import { isValidForm } from '@cerebral/forms/operators'

export default [
  isValidForm(state`my.form`),
  {
    true: [],
    false: []
  }
]
```

### resetForm

Reset a form.

```js
import { state } from 'cerebral/tags'
import { resetForm } from '@cerebral/forms/operators'

export default [resetForm(state`my.form`)]
```

### setField

When you change the value of a field you will need to use this operator. Note that you point to the field, not the field value.

```js
import { state, props } from 'cerebral/tags'
import { setField } from '@cerebral/forms/operators'

export default [setField(state`my.form.field`, props`value`)]
```

## provider

You can also access your forms in actions.

```js
function myAction({ forms }) {
  const form = forms.get('path.to.form')
}
```

### reset

Reset the form to its default values (or empty string by default).

```js
function myAction({ forms }) {
  forms.reset('path.to.form')
}
```

### toJSON

Typically you want to convert your forms to a plain value structure.

```js
function myAction({ forms }) {
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

### updateErrorMessages

Dynamically update global error messages:

```js
function myAction({ forms }) {
  forms.updateErrorMessages({
    someRule() {}
  })
}
```

### updateRules

Dynamically update available rules:

```js
function myAction({ forms }) {
  forms.updateRules({
    someNewRule() {}
  })
}
```

## validationRules

You add validation rules on the field:

```js
{
  myForm: {
    firstName: {
      value: '',
      validationRules: ['minLength:3']
    }
  }
}
```

### equals:Value

```js
{
  field1: {
    value: 123, // valid
    validationRules: ['equals:123']
  },
  field2: {
    value: '123', // valid
    validationRules: ['equals:"123"']
  },
  field3: {
    value: [], // not valid
    validationRules: ['equals:[]']
  }
}
```

### equalsField:Field

```js
{
  field1: {
    value: 'foo', // valid
    validationRules: ['equalsField:full.path.to.form.field2']
  },
  field2: {
    value: 'foo', // valid
    validationRules: ['equalsField:full.path.to.form.field1']
  },
  field3: {
    value: 'bar', // not valid
    validationRules: ['equalsField:full.path.to.form.field2']
  }
}
```

### isAlpha

```js
{
  field1: {
    value: 'abc', // valid
    validationRules: ['isAlpha']
  },
  field2: {
    value: 'AbC', // valid
    validationRules: ['isAlpha']
  },
  field3: {
    value: '123abc', // not valid
    validationRules: ['isAlpha']
  }
}
```

### isAlphanumeric

```js
{
  field1: {
    value: '123abc', // valid
    validationRules: ['isAlphanumeric']
  },
  field2: {
    value: '123', // valid
    validationRules: ['isAlphanumeric']
  },
  field3: {
    value: '123+abc', // not valid
    validationRules: ['isAlphanumeric']
  }
}
```

### isEmail

```js
{
  field1: {
    value: 'ho@hep.co', // valid
    validationRules: ['isEmail']
  },
  field2: {
    value: 'hello@', // not valid
    validationRules: ['isEmail']
  },
  field3: {
    value: 'hel.co', // not valid
    validationRules: ['isEmail']
  }
}
```

### isEmpty

```js
{
  field1: {
    value: '', // valid
    validationRules: ['isEmpty']
  },
  field2: {
    value: 'hello', // not valid
    validationRules: ['isEmpty']
  },
  field3: {
    value: 123, // not valid
    validationRules: ['isEmpty']
  }
}
```

### isExisty

```js
{
  field1: {
    value: 0, // valid
    validationRules: ['isExisty']
  },
  field2: {
    value: [], // valid
    validationRules: ['isExisty']
  },
  field3: {
    value: null, // not valid
    validationRules: ['isExisty']
  }
}
```

### isFalse

```js
{
  field1: {
    value: false, // valid
    validationRules: ['isFalse']
  },
  field2: {
    value: 'false', // not valid
    validationRules: ['isFalse']
  },
  field3: {
    value: true, // not valid
    validationRules: ['isFalse']
  }
}
```

### isFloat

```js
{
  field1: {
    value: '22.5', // valid
    validationRules: ['isFloat']
  },
  field2: {
    value: 22.5, // valid
    validationRules: ['isFloat']
  },
  field3: {
    value: '22', // not valid
    validationRules: ['isFloat']
  }
}
```

### isInt

```js
{
  field1: {
    value: '123', // valid
    validationRules: ['isInt']
  },
  field2: {
    value: 123, // valid
    validationRules: ['isInt']
  },
  field3: {
    value: '22.5', // not valid
    validationRules: ['isInt']
  }
}
```

### isLength:Number

```js
{
  field1: {
    value: 'hey', // valid
    validationRules: ['isLength:3']
  },
  field2: {
    value: ['foo', 'bar'], // valid
    validationRules: ['isLength:2']
  },
  field3: {
    value: 'hm 123', // not valid
    validationRules: ['isLength:3']
  }
}
```

### isNumeric

```js
{
  field1: {
    value: '123', // valid
    validationRules: ['isNumeric']
  },
  field2: {
    value: 123, // valid
    validationRules: ['isNumeric']
  },
  field3: {
    value: '123abc', // not valid
    validationRules: ['isNumeric']
  }
}
```

### isSpecialWords

```js
{
  field1: {
    value: 'hey there', // valid
    validationRules: ['isSpecialWords']
  },
  field2: {
    value: 'some  åäö', // valid
    validationRules: ['isSpecialWords']
  },
  field3: {
    value: 'hm 123', // not valid
    validationRules: ['isSpecialWords']
  }
}
```

### isTrue

```js
{
  field1: {
    value: true, // valid
    validationRules: ['isTrue']
  },
  field2: {
    value: 'true', // not valid
    validationRules: ['isTrue']
  },
  field3: {
    value: false, // not valid
    validationRules: ['isTrue']
  }
}
```

### isUndefined

```js
{
  field1: {
    value: undefined, // valid
    validationRules: ['isUndefined']
  },
  field2: {
    value: 'hello', // not valid
    validationRules: ['isUndefined']
  },
  field3: {
    value: 123, // not valid
    validationRules: ['isUndefined']
  }
}
```

### isUrl

```js
{
  field1: {
    value: 'http://www.test.com', // valid
    validationRules: ['isUrl']
  },
  field2: {
    value: 'http://www', // not valid
    validationRules: ['isUrl']
  },
  field3: {
    value: 'http//www', // not valid
    validationRules: ['isUrl']
  }
}
```

### isWords

```js
{
  field1: {
    value: 'hey there', // valid
    validationRules: ['isWords']
  },
  field2: {
    value: 'wut åäö', // not valid
    validationRules: ['isWords']
  },
  field3: {
    value: 'hm 123', // not valid
    validationRules: ['isWords']
  }
}
```

### isValue

```js
{
  field1: {
    value: 'test', // valid
    validationRules: ['isValue']
  },
  field2: {
    value: [], // not valid
    validationRules: ['isValue']
  },
  field3: {
    value: null, // not valid
    validationRules: ['isValue']
  },
  field3: {
    value: false, // not valid
    validationRules: ['isValue']
  }
}
```

### maxLength:Number

```js
{
  field1: {
    value: '123', // valid
    validationRules: ['maxLength:3']
  },
  field2: {
    value: 'fo', // valid
    validationRules: ['maxLength:3']
  },
  field3: {
    value: ['foo', 'bar', 'baz', 'mip'], // not valid
    validationRules: ['maxLength:3']
  }
}
```

### minLength:Number

```js
{
  field1: {
    value: '123', // valid
    validationRules: ['minLength:3']
  },
  field2: {
    value: 'fo', // not valid
    validationRules: ['minLength:3']
  },
  field3: {
    value: ['foo', 'bar', 'baz', 'mip'], // valid
    validationRules: ['minLength:3']
  }
}
```

### regexp

```js
{
  field1: {
    value: 'foo', // valid
    validationRules: [/foo/]
  },
  field2: {
    value: 'bar', // not valid
    validationRules: [/foo/]
  }
}
```
