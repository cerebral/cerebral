import Provider from "./Provider";

// Should create our own interface for that, or use one from original Redux types (if there are one)
// Using original types adds another dependency
declare function ReduxProvider(store: any): Provider;

export default ReduxProvider;