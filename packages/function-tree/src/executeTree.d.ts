import { FunctionTreePrimitive, Payload } from "./primitives";

type RunFunctionResolve = (funcDetails: FunctionTreePrimitive, payload: Payload, prevPayload: Payload, next: any) => void;
type BranchStartCallback = (funcDetails: FunctionTreePrimitive, path: string, payload: Payload) => void;
type BranchEndCallback = (payload: Payload) => void;
type ParallelStartEndCallback = (payload: Payload, itemLength: number) => void;
type ParallelProgressCallback = (payload: Payload, remainingLength: number) => void;

declare function executeTree(
    tree: Array<FunctionTreePrimitive>,
    resolveFunctionResult: RunFunctionResolve,
    initialPayload: Payload,
    branchStart: BranchStartCallback,
    branchEnd: BranchEndCallback,
    parallelStart: ParallelStartEndCallback,
    parallelProgress: ParallelProgressCallback,
    parallelEnd: ParallelStartEndCallback,
    end: BranchEndCallback
): void;

export default executeTree;
