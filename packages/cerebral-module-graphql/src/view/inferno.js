import Tag from 'cerebral/lib/tags/Tag'
import Inferno from 'inferno'
import createElement from 'inferno-create-element'
import Component from 'inferno-component'
import HocFactory from './hoc'
import {connect as infernoConnect} from 'cerebral/inferno'

Inferno.createElement = createElement
Inferno.Component = Component

export function query (strings, ...values) {
  return new Tag('query', {}, strings, values)
}

export const connect = HocFactory(Inferno, null, infernoConnect)
