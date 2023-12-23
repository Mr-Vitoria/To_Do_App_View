import React, { Component } from 'react';
import { NavMenu } from './NavMenu';

import '../public/css/site.css'
import { TaskContextMenu } from './TaskContextMenu';
import { TaskGroupContextMenu } from './TaskGroupContextMenu';
import { TaskSettingModal } from './TaskSettingModal';
import { LoadingWindow } from './LoadingWindow';
import ErrorBoundary from './ErrorBoundary';

export class Layout extends Component {
    static displayName = Layout.name;
    constructor(props) {
        super(props);
        this.state = {
            needMenu: false
        };
        Layout.changeNeedMenu = this.changeNeedMenu.bind(this);
    }


    changeNeedMenu(needMenu) {
        this.setState({
            needMenu: needMenu
        });
    }

    render() {
        return (
            <>
                {this.state.needMenu ?
                    <NavMenu />
                    : null
                }
                <ErrorBoundary>

                    {this.props.children}
                </ErrorBoundary>


                <TaskContextMenu />
                <TaskGroupContextMenu />
                <TaskSettingModal />

                <LoadingWindow />
            </>
        );
    }
}
