import { FunctionTreePrimitive, Payload } from "../primitives";

// What interface context has ? Should it be extendable ?
declare function Provider(context: any, funcDetails: FunctionTreePrimitive, payload: Payload, next: Payload): any;

export default Provider;