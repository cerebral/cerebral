import { FunctionTreePrimitive, Payload } from "../primitives";

declare function Provider(context: any, funcDetails: FunctionTreePrimitive, payload: Payload, next: any): any;

export default Provider;