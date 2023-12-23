import React, { Component } from 'react';
import '../public/css/site.css';

export class LoadingWindow extends Component {
    static displayName = LoadingWindow.name;

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
        LoadingWindow.closeWindow = this.closeWindow.bind(this);
        LoadingWindow.openWindow = this.openWindow.bind(this);
    }

    openWindow() {
        this.setState({
            isLoading: true
        });
    }
    closeWindow() {
        this.setState({
            isLoading: false
        });
    }

    render() {
        return (
            <>
                <div className={this.state.isLoading ? "loadingWindow open" : "loadingWindow close"}>
                    <div className="spinner"></div>
                </div>
            </>
        );
    }
}
