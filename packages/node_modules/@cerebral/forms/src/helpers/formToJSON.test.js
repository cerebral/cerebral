/* eslint-env mocha */
import formToJSON from './formToJSON'
import assert from 'assert'

describe('formToJSON', () => {
  it("should return nested form with only it's values", () => {
    assert.deepEqual(
      formToJSON({
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
      }),
      {
        name: 'Ben',
        age: 14,
        address: {
          delivery: 'Some address',
        },
      }
    )
  })
  it("should return nested form array with only it's values", () => {
    assert.deepEqual(
      formToJSON({
        name: {
          value: 'Ben',
        },
        age: {
          value: 14,
        },
        addresses: [
          {
            delivery: {
              value: 'Some address',
            },
          },
          {
            delivery: {
              value: 'Another address',
            },
          },
        ],
      }),
      {
        name: 'Ben',
        age: 14,
        addresses: [
          {
            delivery: 'Some address',
          },
          {
            delivery: 'Another address',
          },
        ],
      }
    )
  })
  it('should return values for array of forms', () => {
    assert.deepEqual(
      formToJSON([
        {
          name: {
            value: 'Jane',
          },
        },
        {
          name: {
            value: 'Joe',
          },
        },
      ]),
      [
        {
          name: 'Jane',
        },
        {
          name: 'Joe',
        },
      ]
    )
  })
})
