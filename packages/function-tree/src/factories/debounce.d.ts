declare interface DebounceFunction {
    displayName: string;
    // What Promise returns ?
    (params: { path: string }): Promise<any>;
}

declare interface DebounceFactory {
    (time: number): DebounceFunction;
    shared(): (time: number) => DebounceFunction;
}

export default DebounceFactory;
