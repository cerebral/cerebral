import { FunctionTreePrimitive, Parallel, Payload, Sequence } from "./primitives";
// Dependency on "events" from @types/node, maybe is there a better way ? Or there should be another dependency ?
import { EventEmitter } from "events";
import Provider from "./providers/Provider";

declare function sequence(items: Array<FunctionTreePrimitive>): Sequence;
declare function sequence(name: string, items: Array<FunctionTreePrimitive>): Sequence;

declare function parallel(items: Array<FunctionTreePrimitive>): Parallel;
declare function parallel(name: string, items: Array<FunctionTreePrimitive>): Parallel;

declare interface RunTreeFunction {
    (): void;
    on(event: string | symbol, listener: Function): this;
    once(event: string | symbol, listener: Function): this;
    off(event: string | symbol, listener: Function): this;
}

declare class FunctionTree extends EventEmitter {
    constructor(contextProviders: Array<Provider>);
    cachedTrees: Array<FunctionTreePrimitive>;
    contextProviders: Array<Provider>;
    runTree: RunTreeFunction;
    
    createContext(funcDetails: FunctionTreePrimitive, payload: Payload, prevPayload: Payload): Array<Provider>;
}

export { sequence, parallel, FunctionTree };

declare function _default(contextProviders: Array<Provider>): RunTreeFunction;

export default _default;
