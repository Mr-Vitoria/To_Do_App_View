import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

export class NavMenu extends Component {
    static displayName = NavMenu.name;

    constructor(props) {
        super(props);


        const cookies = new Cookies();
        this.state = {
            userName: cookies.get("userName"),
            userImage: cookies.get("userImage"),
            toProjectList: false,
            toSetting: false,
            toMainPage: false,
            activePage: "ProjectList"
        };

        NavMenu.logoutUser = this.logoutUser.bind(this);
    }

    logoutUser() {

        const cookies = new Cookies();
        cookies.remove('userId');
        cookies.remove('userImage');
        cookies.remove('userName');

        this.setState({
            toMainPage: true,
            activePage: "Main"
        });
    }

    redirectToProjectList() {
        this.setState({
            toProjectList: true,
            activePage: "ProjectList"
        });
    }
    redirectToSetting() {
        this.setState({
            toSetting: true,
            activePage: "Setting"
        });
    }

    render() {
        if (this.state.toProjectList) {
            this.setState({
                toProjectList: false,
            });
            return <Navigate to='/project' replace={true} />;
        }
        if (this.state.toSetting) {
            this.setState({
                toSetting: false,
            });
            return <Navigate to='/setting' replace={true} />;
        }
        if (this.state.toMainPage) {
            this.setState({
                toMainPage: false,
            });
            return <Navigate to='/' replace={true} />;
        }
        return (
            <header >

                <ul>
                    <li>
                        <button className="avatar">
                            <img src={this.state.userImage} alt="..."/>
                            <span>{this.state.userName}</span>
                        </button>
                    </li>
                    <li className={this.state.activePage === "ProjectList" ? "active": ""}>
                        <button onClick={(ev) => {
                            this.redirectToProjectList();
                        }}><i className="fa-solid fa-house"></i><span>Главная</span></button>
                    </li>
                    <li className={this.state.activePage === "Setting" ? "active" : ""}>
                        <button onClick={(ev) => {
                            this.redirectToSetting();
                        }}><i className="fa-solid fa-gear"></i><span>Настройки</span></button>
                    </li>
                    <li>
                        <button onClick={(ev) => {
                            NavMenu.logoutUser();
                        }} className="logout"><i className="fa-solid fa-right-from-bracket"></i><span>Выход</span></button>
                    </li>
                </ul>
            </header>
        );
    }
}
