import { Compute } from 'cerebral'
import { state } from 'cerebral/tags'

export const someComputed: { name: string } = Compute((get) => ({
  name: get(state`app.name`) + (get(state`app.ready`) ? ' is ready' : ''),
}))
