import { Payload } from "./primitives";

// Is 'path' correct ?
declare interface IPath {
    path: string;
    payload: Payload;
}

declare class Path implements IPath {
    constructor(public path: string, public payload: Payload);
    toJS (): IPath;
}

export default Path
