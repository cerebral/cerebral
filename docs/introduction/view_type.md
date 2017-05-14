# Choosing a view type
Cerebral technically can use any view layer. Currently it officially supports [React](https://facebook.github.io/react/) and [Inferno](http://infernojs.org/). From a Cerebral perspective they have the exact same API, you just have to choose to import from **cerebral/react** or **cerebral/inferno**. For specific API differences of the two view libraries please check their documentation.

Choose React if you want a huge ecosystem of shared components and documentation. Inferno is faster than React and is recommended to be used when you do not depend heavily on 3rd party components.

**NPM**

`npm install react react-dom babel-preset-react --save`

`npm install inferno inferno-component inferno-create-element babel-plugin-inferno --save`

**YARN**

`yarn add react react-dom babel-preset-react`

`yarn add inferno inferno-component inferno-create-element babel-plugin-inferno`
