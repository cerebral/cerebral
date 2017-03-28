import { Sequence, Parallel, FunctionTreePrimitive } from "./primitives";

declare function StaticTree(tree: Sequence | Parallel | FunctionTreePrimitive | Array<Function | Sequence | Parallel>): Array<FunctionTreePrimitive>;

export default StaticTree;