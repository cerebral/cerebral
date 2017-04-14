import React from 'react'
import ContainerFactory from './Container'
import StateContainerFactory from './StateContainer'
import HocFactory from './Hoc'
import connectFactory, { decoratorFactory } from './connect'

let PropTypes
const [major, minor] = React.version.split('.')

if ((major === '15' && minor >= 5) || major >= 16) {
  try {
    PropTypes = require('prop-types')
  } catch (e) {
    console.error(
      'In order to support react@15.5+, you need to have prop-types package installed. ' +
      'Please add prop-types to your dependencies (`npm install --save prop-types`)'
    )
    throw e
  }
}

PropTypes = PropTypes || React.PropTypes

export const Container = ContainerFactory(React, PropTypes)
export const StateContainer = StateContainerFactory(React, PropTypes)
export const connect = connectFactory(HocFactory(React, PropTypes))
export const decorator = decoratorFactory(HocFactory(React, PropTypes))
