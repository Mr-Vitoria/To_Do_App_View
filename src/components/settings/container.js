import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Layout } from '../Layout';
import SettingUser from './settingUser.js';
import styles from '../../public/css/setting.module.css';

export class SettingContainer extends Component {
    static displayName = SettingContainer.name;

    constructor(props) {
        super(props);

        Layout.changeNeedMenu(true);

        let userId = -1;
        const cookies = new Cookies();
        if (cookies.get('userId') != null) {
            userId = cookies.get('userId');
        }


        this.state = {
            userId: userId,
            page: userId == -1 ? "Auth" : "List"
        }

    }

    render() {
        if (this.state.page == "Auth") {
            return ( <Navigate to='/auth' /> );
        }
        return (
            <section className={ styles.setting}>
                <SettingUser userId={this.state.userId} />
            </section>
        );
    }
}