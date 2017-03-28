declare interface IPath {
    path: string;
    payload: any;
}

declare interface Path extends IPath {
    new (path: string, payload: any);
    toJS (): IPath;
}

export default Path
