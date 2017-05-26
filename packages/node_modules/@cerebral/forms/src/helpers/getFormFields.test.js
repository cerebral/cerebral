/* eslint-env mocha */
import getFormFields from './getFormFields'
import assert from 'assert'

describe('getFormFields', () => {
  it('should return fields for form and nested form', () => {
    const fields = getFormFields({
      name: {
        value: 'Ben',
      },
      age: {
        value: 14,
      },
      address: {
        delivery: {
          value: 'Some address',
        },
      },
    })
    assert.equal(fields.name.value, 'Ben')
    assert.equal(fields.age.value, 14)
    assert.equal(fields['address.delivery'].value, 'Some address')
  })

  it('should return fields for form in array', () => {
    const fields = getFormFields([
      {
        form1: {
          fields: [
            {
              name: {
                value: 'Doe',
              },
            },
          ],
          name: {
            value: 'Jane Doe',
          },
        },
      },
      {
        name: {
          value: 'Joe Doe',
        },
      },
    ])
    assert.deepEqual(fields, {
      '0.form1.name': {
        value: 'Jane Doe',
      },
      '0.form1.fields.0.name': {
        value: 'Doe',
      },
      '1.name': {
        value: 'Joe Doe',
      },
    })
  })
})
