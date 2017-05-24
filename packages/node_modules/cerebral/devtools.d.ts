interface DevOptions {
  remoteDebugger: string
  storeMutations?: boolean
  preventExternalMutations?: boolean
  preventPropsReplacement?: boolean
  bigComponentsWarning?: number
  allowedTypes?: any[]
  doReconnect?: boolean
}

export default class DevTools {
  constructor(options: DevOptions);
}