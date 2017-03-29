import { Abort } from "../Abort";
import Provider from "./Provider";

// What shape execution has ?
declare function ExecutionProvider(execution: any, Abort: Abort): Provider;

export default ExecutionProvider;