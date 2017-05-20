import { Controller } from "..";
import DevTools from "../devtools";

const controller = new Controller({
    devtools: new DevTools({
        remoteDebugger: "1.1.1.1"
    })
});


controller.getSignal("ASD");