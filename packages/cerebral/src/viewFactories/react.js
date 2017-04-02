import React from 'react'
import ReactDOM from 'react-dom'
import ContainerFactory from './Container'
import StateContainerFactory from './StateContainer'
import HocFactory from './Hoc'
import connectFactory, { decoratorFactory } from './connect'

const deferredUpdates = ReactDOM.unstable_deferredUpdates || ReactDOM.deferredUpdates

export const Container = ContainerFactory(React)
export const StateContainer = StateContainerFactory(React)
export const connect = connectFactory(HocFactory(React, deferredUpdates ? deferredUpdates.bind(ReactDOM) : null))
export const decorator = decoratorFactory(HocFactory(React, deferredUpdates ? deferredUpdates.bind(ReactDOM) : null))
