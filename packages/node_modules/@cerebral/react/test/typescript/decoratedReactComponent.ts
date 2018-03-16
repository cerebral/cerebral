import * as React from 'react'
import { decorator as connect } from '../..'
/* eslint-disable no-unused-vars */
import { state } from 'cerebral/tags'
import { someComputed } from './computed'
/* eslint-enable no-unused-vars */

@connect({
  composing: state`composer.$running`,
  error: state`composer.$error`,
  name: someComputed,
})
export class Running extends React.Component<any, any> {
  render() {
    return React.createElement('div', {}, 'hello')
  }
}
