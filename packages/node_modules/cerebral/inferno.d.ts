export class StateContainer {

}

export class Container {
    getChildContext(): any
    render(): any
}

export function connect(props: any, comp: (props: any) => void): any