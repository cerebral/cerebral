export declare interface FunctionTreePrimitive {
    name?: string;
    "function": Function;
    functionIndex: number;
    items: Array<FunctionTreePrimitive>;
    type: "parallel" | "sequence";
    _functionTreePrimitive: boolean;
    outputs?: { [name: string]: FunctionTreePrimitive };
}

export declare interface Sequence {
    new (items: Array<FunctionTreePrimitive>);
    new (name: string, items: Array<FunctionTreePrimitive>);
    
    toJSON(): FunctionTreePrimitive;
}

export declare interface Parallel {
    new (items: Array<FunctionTreePrimitive>);
    new (name: string, items: Array<FunctionTreePrimitive>);
    
    toJSON(): FunctionTreePrimitive;
}