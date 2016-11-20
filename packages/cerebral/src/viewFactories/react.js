import React from 'react'
import ContainerFactory from './Container'
import StateContainerFactory from './StateContainer'
import HocFactory from './Hoc'
import connectFactory, { connectDecoratorFactory } from './connect'

export const Container = ContainerFactory(React)
export const StateContainer = StateContainerFactory(React)
export const connect = connectFactory(HocFactory(React))
export const connectDecorator = connectDecoratorFactory(HocFactory(React))
