import React, { Component } from 'react';
import { LoadingBlock } from '../LoadingBlock';
import Cookies from 'universal-cookie';

import styles from '../../public/css/setting.module.css';
import { NavMenu } from '../NavMenu';
import ImageChangeModal from './imageChangeModal';

export default class SettingUser extends Component {
    static displayName = SettingUser.name;

    constructor(props) {
        super(props);

        this.state = {
            userId : props.userId,
            user: null,
            loadingUser: true,
            changeImage: false,
            userImg: ""
        }

        this.inputLoginRef = React.createRef();
        this.inputEmailRef = React.createRef();

        this.closeModalImage = this.closeModalImage.bind(this);
        this.updateImage = this.updateImage.bind(this);

    }

    //Item life cycle
    componentDidMount() {
        this.loadUserData();
    }

    //Update state functions
    openModalImage() {

        this.setState({
            changeImage: true
        });
    }
    closeModalImage() {

        this.setState({
            changeImage: false
        });
    }
    updateImage(image) {

        this.setState({
            userImg: image
        });

        this.updateUser(image);
        this.closeModalImage();
    }

    render() {
        return (
            <>
                {
                    this.state.changeImage ?
                        <ImageChangeModal
                            userImg={this.state.user.imgUrl}
                            closeModal={this.closeModalImage}
                            updateImage={this.updateImage}
                        />
                    :
                    null
                }
                {
                    this.state.loadingUser ?
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100vw",
                            height: "100vh",
                            position: "fixed"
                        }}>
                            <LoadingBlock />
                        </div>
                    :
                    <section className={styles.userSetting}>
                        <h2>Настройки пользователя</h2>
                            <img onClick={(ev) => {
                                this.openModalImage();
                            }} src={this.state.userImg} />
                        <div className={styles.infoContainer}>
                            <div className={styles.inputContainer}>
                                <label>Логин</label>
                                <input
                                    defaultValue={this.state.user.login}
                                    ref={this.inputLoginRef}
                                    type="text"
                                    placeholder="Имя пользователя"
                                    onChange={(ev) => {
                                        this.updateUser();
                                    }}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <label>Email</label>
                                <input
                                    defaultValue={this.state.user.email}
                                    ref={this.inputEmailRef}
                                    type="email"
                                    readOnly={true}
                                    placeholder="Email пользователя"
                                />
                            </div>
                            <div className={styles.btnContainer}>
                                <button onClick={(ev) => {
                                    this.removeUser();
                                }} className={styles.btnWarn}>Удалить аккаунт</button>
                                <button onClick={(ev) => {
                                    NavMenu.logoutUser();
                                }}>Выйти</button>
                            </div>
                        </div>
                    </section>
                }
            </>
        );
    }

    //Work with HTTP response functions
    async loadUserData() {
        const response = await fetch('/user/get?id=' + this.state.userId);
        let data = await response.json();

        this.setState({
            loadingUser: false,
            user: data,
            userImg: data.imgUrl
        });
    }

    async updateUser(image) {

        if (image == null) {
            image = this.state.userImg;
        }
        await fetch('/user/update?id=' + this.state.userId
            + '&login=' + this.inputLoginRef.current.value
            + '&imgUrl=' + image
        );

        const cookies = new Cookies();

        cookies.set('userName', this.inputLoginRef.current.value, { path: '/', maxAge: 86400 });
        cookies.set('userImage', image, { path: '/', maxAge: 86400 });

    }
    async removeUser() {

        await fetch('/user/remove?id=' + this.state.userId);
        NavMenu.logoutUser();
    }
}