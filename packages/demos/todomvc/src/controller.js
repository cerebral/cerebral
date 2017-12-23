import { Controller } from 'cerebral'
import Devtools from 'cerebral/devtools'
import app from './app'

const controller = Controller(app, {
  devtools: Devtools({ host: 'localhost:8686' }),
})

export default controller
