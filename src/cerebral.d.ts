declare module "cerebral" {
    interface ICommonModule {
        addModules(modules: any): void;
        addSignals(signals: any): void;
        addServices(services: any): void;
        addContextProvider(contextProvider: any): void;
    }

    export interface IModule<TState> extends ICommonModule {
        addState(state: TState): void;
    }

    import {Devtools} from 'cerebral/devtools'
    import {Router} from 'cerebral/router'

    interface IControllerParams {
        state?: Object,
        routes?: Object,
        signals?: Object,
        providers?: Object,
        modules?: Object,
        router: Router,
        devtools: Devtools
    }

    export interface IController extends ICommonModule {
        (model?: IControllerParams): IController;

        getState(path: string): any;
        getSignal(path: string): any;
        runSignal(name: string, signal: string, payload?: Object);
        getModel(): any;
        flush(): void;

        on(eventName: string, callback: Function): void;
    }

    export interface IStateModel {
        get(): any;
        get<T>(path: string): T;
        set<T>(path: string, value: T): void;
        unset(path: string): void;
        unset<T>(path: string, value: T[]): void;
        merge<T>(path: string, value: T): void;
        push<T>(path: string, value: T): void;
        unshift<T>(path: string, value: T): void;
        pop(path: string): void;
        shift(path: string): void;
        concat<T>(path: string, value: T[]): void;
        splice(path: string, startIndex: number, amount: number): void;
    }

    export interface Map {
        [id: string]: any;
    }

    export const Controller: IController;
    export function Computed<T, TRet>(stateMap: Map, computed: (props: T) => TRet);
}

declare module "cerebral/operators" {
    export function unset(path: string): any;
    export function set(path: string, value: any): any;
    export function copy(sourcePath: string, destPath: string): any;
    export function toggle(path: string): any;
    export function when(conditionPath: string, then: any): any;
    export function delay(timeoutMilliseconds: number, chain: any[]): any[];

    export function throttle(throttleTimeMilliseconds: number): any;
    export function throttle(throttleTimeMilliseconds: number, chain: any[]): any[];

    export function debounce(debounceTimeMilliseconds: number): any;
    export function debounce(debounceTimeMilliseconds: number, chain: any[]): any[];

    export function filter(path: string, filter: (value: any) => boolean): any;
    export function filter(path: string, filter: (value: any) => boolean, chain: any[]): any[];
}

declare module 'cerebral/react' {
    import { SFC, ComponentClass, ClassicComponentClass } from 'react';
    import { IController, Map } from 'cerebral';

    type Components<P> = ComponentClass<P> | ClassicComponentClass<P> | SFC<P>;
    
    export interface ContainerProps {
        controller?: IController;
        state?: Object; 
        [id: string]: any;
    }

    export const Container: Components<ContainerProps>;
    
    export function connect<ExtProps>(stateMap: Map, signalsMap: Map, component: Components<ExtProps>): ClassicComponentClass<ExtProps>
    export function connect<ExtProps>(stateMap: Map, component: Components<ExtProps>): ClassicComponentClass<ExtProps>
    export function connect<ExtProps>(stateMap: (props: ExtProps) => Map, signalsMap: Map, component: Components<ExtProps>): ClassicComponentClass<ExtProps>
    export function connect<ExtProps>(stateMap: (props: ExtProps) => Map, component: Components<ExtProps>): ClassicComponentClass<ExtProps>
}

declare module "cerebral/devtools" {
    export interface Devtools {}
    export default function (): Devtools;
}

declare module "cerebral/router" {
    export interface Router {}
    export default function (): Router;
}