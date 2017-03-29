import { Payload } from "./primitives";
declare interface IPath {
    path: Path;
    payload: Payload;
}

declare class Path implements IPath {
    constructor(public path: Path, public payload: Payload);
    toJS (): IPath;
}

export default Path
