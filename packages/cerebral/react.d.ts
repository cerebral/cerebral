export class StateContainer {

}

export class Container extends React.Component {
    getChildContext(): any
    render(): JSX.Element | null
}
export function connect(props: any, comp: (props: any) => void): any