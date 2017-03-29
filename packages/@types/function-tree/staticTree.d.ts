import { Sequence, Parallel, FunctionTreePrimitive } from "./primitives";

declare function createStaticTree(tree: Sequence | Parallel | FunctionTreePrimitive | Array<Function | Sequence | Parallel>): Array<FunctionTreePrimitive>;

export default createStaticTree;