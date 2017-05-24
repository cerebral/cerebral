import {compute} from 'cerebral'
import urlMapper from 'url-mapper'
import baseRouter from './base'

const defaultMapper = urlMapper({query: true})

export function getSignalUrlFactory (config) {
  return (signal, payload) => compute(signal, payload)
}

export default function (options = {}) {
  return baseRouter(Object.assign(options, {mapper: defaultMapper}))
}
