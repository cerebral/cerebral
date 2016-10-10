import Inferno from 'inferno'
import createElement from 'inferno-create-element'
import Component from 'inferno-component'
import Hoc from './../viewFactories/Hoc'

Inferno.createElement = createElement
Inferno.Component = Component

export default Hoc(Inferno)
