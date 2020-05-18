import * as React from 'react';
import { Observable, Subscription } from 'rxjs';

interface Props<T> {
    observable: Observable<T>;
    children: (val: T|undefined, haveVal: boolean) => React.ReactNode;
}

export type State<T> = {
    value?: T;
    haveValue: boolean;
};

export class Subscriber<T> extends React.Component<Props<T>, State<T>> {
    private subscription?: Subscription;

    constructor(props: Props<T>) {
        super(props);

        this.state = {
            haveValue: false,
        };
    }

    componentWillMount() {
        this.subscription = this.props.observable.subscribe(value => {
            this.setState({ value, haveValue: true });
        });
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    render() {
        return this.props.children(this.state.value, this.state.haveValue);
    }
}