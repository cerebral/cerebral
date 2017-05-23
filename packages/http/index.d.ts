import { Provider } from "function-tree"

export class HttpProviderError extends Error {
  constructor (status: Number, headers: any, body: any, message?: string, isAborted?: boolean)
  toJSON () : any
}
export default function HttpProvider(options: any): Provider 
