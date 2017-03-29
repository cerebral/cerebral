export declare interface FunctionTreePrimitive {
    name?: string;
    "function": Function;
    functionIndex: number;
    items: Array<FunctionTreePrimitive>;
    type: "parallel" | "sequence";
    _functionTreePrimitive: boolean;
    outputs?: { [name: string]: FunctionTreePrimitive };
}

export declare class Sequence {
    constructor(items: Array<FunctionTreePrimitive>);
    constructor(name: string, items: Array<FunctionTreePrimitive>);
    
    toJSON(): FunctionTreePrimitive;
}

export declare class Parallel {
    constructor(items: Array<FunctionTreePrimitive>);
    constructor(name: string, items: Array<FunctionTreePrimitive>);
    
    toJSON(): FunctionTreePrimitive;
}

export declare interface Payload {
    [key: string]: any;
    [key: number]: any;
}