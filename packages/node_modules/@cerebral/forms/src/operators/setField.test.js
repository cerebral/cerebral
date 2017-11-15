/* eslint-env mocha */
import { Controller, Module } from 'cerebral'
import { state } from 'cerebral/tags'
import setField from './setField'
import assert from 'assert'
import FormsProvider from '../'

describe('setField', () => {
  it('should set field', () => {
    const controller = Controller(
      Module({
        providers: { forms: FormsProvider() },
        signals: {
          test: [
            setField(state`form.name`, 'foo'),
            ({ forms }) => {
              const form = forms.get('form')
              assert.equal(form.name.value, 'foo')
              assert.equal(form.name.isPristine, false)
            },
          ],
        },
        state: {
          form: {
            name: {
              value: 'Ben',
            },
          },
        },
      })
    )
    controller.getSignal('test')()
  })
  it('should throw when field path is not a state tag', () => {
    let errorCount = 0
    const controller = Controller(
      Module({
        providers: { forms: FormsProvider() },
        signals: {
          test: [setField('form.name', 'foo')],
        },
        catch: [
          [
            Error,
            [
              ({ props }) => {
                errorCount++
                assert.equal(props.error.name, 'Error')
                assert.equal(
                  props.error.message,
                  'Cerebral Forms - operator.setField: You have to use the STATE TAG as first argument'
                )
              },
            ],
          ],
        ],
        state: {
          form: {
            name: {
              value: 'Ben',
            },
          },
        },
      })
    )
    controller.getSignal('test')()
    assert.equal(errorCount, 1)
  })
})
