import React, { Component } from 'react';
import '../public/css/site.css';

export class LoadingBlock extends Component {
    static displayName = LoadingBlock.name;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: props.isLoading,
            theme: props.theme != null ? props.theme : "light"
        };
    }
    render() {
        return (
            <>
                <div className="loaderContainer">
                    <span className={`loader ${this.state.theme}`}></span>
                </div>
            </>
        );
    }
}
