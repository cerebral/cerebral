import DevTools from "./devtools"
import { FunctionTree } from 'function-tree'

interface IConfig {
    state?: any
    signals?: any
    providers?: any[]
    modules?: any
    router?: any
    devtools?: DevTools
    options?: any
}

export class Controller extends FunctionTree {
    constructor(config: IConfig)
    flush(force: boolean): void
    updateComponents(changes: any[], force: boolean): void
    getModel(): any
    getState(): any
    runSignal(name: string, signal: any[], payload: any): void
    getSignal(path: string): Function
    addModule(path: string, module: any): void
    removeModule(path: string): void
}
export class Compute {
    constructor(...args: any[])
    getValue(): any
}

export function compute(...args: any[]): Compute
export function provide(name: string, provider: any): Function

export { sequence, parallel } from 'function-tree'
