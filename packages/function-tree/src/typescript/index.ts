import * as FunctionTree from "../index";
import { ContextProvider } from "../providers";

const window = { app: {} };

const execute = FunctionTree([
    ContextProvider({
        window,
        request: {
            get: Promise.resolve({status: 200, data: {foo: 'bar'}})
        }
    })
]);

function doRequest(context: any) {
    return context.request.get;
}

function handleSuccess(context: any) {
    context.window.app.data = context.input.data;
}

execute([
    doRequest, {
        success: [ handleSuccess ]
    }
]);