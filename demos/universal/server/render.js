import React from 'react'
import fs from 'fs'
import path from 'path'
import {renderToString} from 'react-dom/server'
import {UniversalController} from 'cerebral'
import {set, when} from 'cerebral/operators'
import {state, props} from 'cerebral/tags'
import {Container} from 'cerebral/react'
import appModule from '../client/modules/app'
import App from '../client/components/App'

const indexTemplate = fs.readFileSync(path.resolve('server', 'index.template.html')).toString()
const controller = UniversalController({
  modules: {
    app: appModule
  }
})
const updateSequence = [
  when(props`name`), {
    true: set(state`app.name`, props`name`),
    false: []
  }
]

export default function render (req) {
  return controller.run(updateSequence, {
      name: req.query.name
    })
      .then(() => {
        return indexTemplate
          .replace('{{CEREBRAL_SCRIPT}}', controller.getScript())
          .replace('{{APP}}', renderToString(
            <Container controller={controller}><App /></Container>
          ))
      })
}
