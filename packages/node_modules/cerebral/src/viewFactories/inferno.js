import Inferno from 'inferno'
import createElement from 'inferno-create-element'
import Component from 'inferno-component'
import ContainerFactory from './Container'
import StateContainerFactory from './StateContainer'
import HocFactory from './Hoc'
import connectFactory, { decoratorFactory } from './connect'

Inferno.createElement = createElement
Inferno.Component = Component

export const Container = ContainerFactory(Inferno)
export const StateContainer = StateContainerFactory(Inferno)
export const connect = connectFactory(HocFactory(Inferno))
export const decorator = decoratorFactory(HocFactory(Inferno))
