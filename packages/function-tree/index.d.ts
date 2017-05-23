import {EventEmitter} from 'eventemitter3'

interface Payload {
    [key: string]: any
    [key: number]: any
}

export interface IPath {
    path: string
    payload: Payload
}

export class Path implements IPath {
    path: string
    payload: Payload
    constructor(path: string, payload: Payload)
    toJS(): IPath
}

export class Abort {
    constructor(payload: Payload)
}

export function createStaticTree(tree: Sequence | Parallel | FunctionTreePrimitive | Array<Function | Sequence | Parallel>): Array<FunctionTreePrimitive>

type RunFunctionResolve = (funcDetails: FunctionTreePrimitive, payload: Payload, prevPayload: Payload, next: any) => void
type BranchStartCallback = (funcDetails: FunctionTreePrimitive, path: string, payload: Payload) => void
type BranchEndCallback = (payload: Payload) => void
type ParallelStartEndCallback = (payload: Payload, itemLength: number) => void
type ParallelProgressCallback = (payload: Payload, remainingLength: number) => void

export function executeTree(
    tree: Array<FunctionTreePrimitive>,
    resolveFunctionResult: RunFunctionResolve,
    initialPayload: Payload,
    branchStart: BranchStartCallback,
    branchEnd: BranchEndCallback,
    parallelStart: ParallelStartEndCallback,
    parallelProgress: ParallelProgressCallback,
    parallelEnd: ParallelStartEndCallback,
    end: BranchEndCallback
): void

export interface FunctionTreePrimitive {
    name?: string
    "function": Function
    functionIndex: number
    items: Array<FunctionTreePrimitive>
    type: "parallel" | "sequence"
    _functionTreePrimitive: boolean
    outputs?: { [name: string]: FunctionTreePrimitive }
}

export class Sequence {
    constructor(items: Array<FunctionTreePrimitive>)
    constructor(name: string, items: Array<FunctionTreePrimitive>)

    toJSON(): FunctionTreePrimitive
}

export class Parallel {
    constructor(items: Array<FunctionTreePrimitive>)
    constructor(name: string, items: Array<FunctionTreePrimitive>)

    toJSON(): FunctionTreePrimitive
}

export function sequence(items: Array<FunctionTreePrimitive>): Sequence
export function sequence(name: string, items: Array<FunctionTreePrimitive>): Sequence

export function parallel(items: Array<FunctionTreePrimitive>): Parallel
export function parallel(name: string, items: Array<FunctionTreePrimitive>): Parallel

export interface RunTreeFunction {
    (): void
    on(event: string | symbol, listener: Function): this
    once(event: string | symbol, listener: Function): this
    off(event: string | symbol, listener: Function): this
}


export interface DebounceFunction {
    displayName: string
    // What Promise returns ?
    (params: { path: string }): Promise<any>
}

export interface DebounceFactory {
    (time: number): DebounceFunction
    shared(): (time: number) => DebounceFunction
}

export interface DevtoolsOptions {
    remoteDebugger: boolean
}

export class Devtools {
    constructor(options: DevtoolsOptions)

    addListeners(): void
    init(): void
    // Should there be object or something else ? Maybe '{}' ?
    safeStringify(object: object): string
    reInit(): void
    sendMessage(message: string): void
    watchExecution(tree: FunctionTree): void
    sendInitial(): void
    // What shape debugggingData and context has ?
    createExecutionMessage(debuggingData: object, context: any, functionDetails: FunctionTreePrimitive, payload: Payload): string
    sendExecutionData(debuggingData: object, context: any, functionDetails: FunctionTreePrimitive, payload: Payload): void
    Provider(): (context: any, functionDetails: FunctionTreePrimitive, payload: Payload) => any
}


export class FunctionTreeError extends Error {
    constructor(error: any)
    toJSON(): any
}

export class FunctionTreeExecutionError extends FunctionTreeError {
    constructor(execution: any, funcDetails: any, payload: any, error: any)
    toJSON(): any
}

export type Provider = (context: any, funcDetails: FunctionTreePrimitive, payload: Payload, next: Payload) => any

export function ReduxProvider(store: any): Provider
export function PropsProvider(): Provider
export function PathProvider(): Provider
export function ExecutionProvider(execution: any, abort: Abort): Provider
export function ContextProvider(extendedContext: any): Provider

export class FunctionTree extends EventEmitter {
    constructor(contextProviders: Array<Provider>)
    cachedTrees: Array<FunctionTreePrimitive>
    contextProviders: Array<Provider>
    runTree: RunTreeFunction

    createContext(funcDetails: FunctionTreePrimitive, payload: Payload, prevPayload: Payload): Array<Provider>
    run(...args: any[]): Promise<any>
}
