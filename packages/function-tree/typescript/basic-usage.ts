import { FunctionTree, ContextProvider } from "..";

const window = { app: {} };

const ft = new FunctionTree([
    ContextProvider({
        window,
        request: {
            get: () => {}
        }
    })
]);


ft.run();