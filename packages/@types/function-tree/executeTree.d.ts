import { FunctionTreePrimitive, Payload } from "./primitives";

interface IRunFunction {
    (funcDetails: FunctionTreePrimitive, payload: Payload, prevPayload: Payload, next: any): void;
}

declare function executeTree(
    tree: Array<FunctionTreePrimitive>,
    resolveFunctionResult: IRunFunction,
    initialPayload: Payload,
    branchStart: any,
    branchEnd: any,
    parallelStart: any,
    parallelProgress: any,
    parallelEnd: any,
    end: any
): void;

export default executeTree;
