import React from 'react'
import PropTypes from 'prop-types'
import ContainerFactory from './Container'
import StateContainerFactory from './StateContainer'
import HocFactory from './Hoc'
import connectFactory, { decoratorFactory } from './connect'

export const Container = ContainerFactory(React, PropTypes)
export const StateContainer = StateContainerFactory(React, PropTypes)
export const connect = connectFactory(HocFactory(React, PropTypes))
export const decorator = decoratorFactory(HocFactory(React, PropTypes))
