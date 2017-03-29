import { FunctionTree } from "../index";
import { FunctionTreePrimitive, Payload } from "../primitives";

declare interface DevtoolsOptions {
    remoteDebugger: boolean;
}

declare class Devtools {
    constructor(options: DevtoolsOptions);
    
    addListeners(): void;
    init(): void;
    safeStringify(object: object): string;
    reInit(): void;
    sendMessage(message: string): void;
    watchExecution(tree: FunctionTree): void;
    sendInitial(): void;
    createExecutionMessage(debuggingData: object, context: any, functionDetails: FunctionTreePrimitive, payload: Payload): string;
    sendExecutionData (debuggingData: object, context: any, functionDetails: FunctionTreePrimitive, payload: Payload): void;
    Provider(): (context: any, functionDetails: FunctionTreePrimitive, payload: Payload) => any;
}