/* eslint-env mocha */
import resetForm from './resetForm'
import assert from 'assert'

describe('resetForm', () => {
  it('should reset form', () => {
    const form = resetForm({
      name: {
        value: 'Ben',
        defaultValue: ''
      }
    })
    assert.equal(form.name.value, '')
    assert.equal(form.name.isPristine, true)
  })
  it('Should reset nested Form', () => {
    const form = resetForm({
      name: {
        value: ''
      },
      address: {
        street: {
          value: 'mop',
          defaultValue: ''
        }
      }
    })
    assert.equal(form.address.street.value, '')
  })
  it('Should reset nested form arrays', () => {
    const form = resetForm({
      name: {
        value: ''
      },
      address: [
        {
          street: {
            value: ''
          }
        },
        {
          street: {
            value: '31 3nd Street',
            defaultValue: ''
          }
        }
      ]
    })
    assert.equal(form.name.value, '')
    assert.equal(form.address[0].street.value, '')
    assert.equal(form.address[1].street.value, '')
  })
})
