import { FunctionTreePrimitive } from "./primitives";
import { EventEmitter } from "events";

declare function sequence(items: Array<FunctionTreePrimitive>);
declare function sequence(name: string, items: Array<FunctionTreePrimitive>);

declare function parallel(items: Array<FunctionTreePrimitive>);
declare function parallel(name: string, items: Array<FunctionTreePrimitive>);

declare interface RunTreeFunction {
    (): void;
    on(event: string | symbol, listener: Function): this;
    once(event: string | symbol, listener: Function): this;
    off(event: string | symbol, listener: Function): this;
}

declare interface FunctionTree extends EventEmitter {
    new (contextProviders: Array<any>);
    cachedTrees: Array<FunctionTreePrimitive>;
    contextProviders: Array<any>;
    runTree: RunTreeFunction;
}

export { sequence, parallel, FunctionTree };

declare function FunctionTreeFactory (contextProviders: Array<any>): RunTreeFunction;

export default FunctionTreeFactory;