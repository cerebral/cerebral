import { FunctionTree } from "../index";
import { FunctionTreePrimitive, Payload } from "../primitives";

declare interface DevtoolsOptions {
    remoteDebugger: boolean;
}

declare class Devtools {
    constructor(options: DevtoolsOptions);
    
    addListeners(): void;
    init(): void;
    // Should there be object or something else ? Maybe '{}' ?
    safeStringify(object: object): string;
    reInit(): void;
    sendMessage(message: string): void;
    watchExecution(tree: FunctionTree): void;
    sendInitial(): void;
    // What shape debugggingData and context has ?
    createExecutionMessage(debuggingData: object, context: any, functionDetails: FunctionTreePrimitive, payload: Payload): string;
    sendExecutionData (debuggingData: object, context: any, functionDetails: FunctionTreePrimitive, payload: Payload): void;
    Provider(): (context: any, functionDetails: FunctionTreePrimitive, payload: Payload) => any;
}