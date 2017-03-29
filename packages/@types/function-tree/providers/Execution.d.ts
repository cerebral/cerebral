import { Abort } from "../Abort";
import Provider from "./Provider";

declare function ExecutionProvider(execution: any, Abort: Abort): Provider;

export default ExecutionProvider;