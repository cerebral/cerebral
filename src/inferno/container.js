import Inferno from 'inferno'
import createElement from 'inferno-create-element'
import Component from 'inferno-component'
import Container from '../viewFactories/Container'

Inferno.createElement = createElement
Inferno.Component = Component

export default Container(Inferno)
