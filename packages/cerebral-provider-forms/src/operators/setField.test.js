/* eslint-env mocha */
import {Controller} from 'cerebral'
import {state} from 'cerebral/tags'
import setField from './setField'
import assert from 'assert'
import FormsProvider from '../'

describe('setField', () => {
  it('should set field', () => {
    const controller = Controller({
      providers: [FormsProvider()],
      signals: {
        test: [
          setField(state`form.name`, 'foo'),
          ({forms}) => {
            const form = forms.get('form')
            assert.equal(form.name.value, 'foo')
            assert.equal(form.name.isPristine, false)
          }
        ]
      },
      state: {
        form: {
          name: {
            value: 'Ben'
          }
        }
      }
    })
    controller.getSignal('test')()
  })
})
