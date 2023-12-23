import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import styles from '../../public/css/autorization.module.css';
import Cookies from 'universal-cookie';
import { Layout } from '../Layout';
import { LoadingWindow } from '../LoadingWindow';
import { LoadingBlock } from '../LoadingBlock';


export class AutorizationContainer extends Component {
    static displayName = AutorizationContainer.name;

    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            toProjectList: false,
            isLoading: false,

            correctPass: false,
            errorRegMessage: "",
            errorLoginMessage: ""
        }

        this.inputLoginEmailRef = React.createRef();
        this.inputLoginPasswordRef = React.createRef();


        this.inputRegLoginRef = React.createRef();
        this.inputRegEmailRef = React.createRef();
        this.inputRegPasswordRef = React.createRef();

        try {
        LoadingWindow.closeWindow();

        } catch (e) {
            console.log(e);
        }

        Layout.changeNeedMenu(false);
    }

    //Item life cycle
    componentDidMount() {
        document.body.classList.remove('body-white');
    }

    //Render functions
    render() {

        if (this.state.toProjectList) {
            return <Navigate to='/' />
        }

        return (
            <>
            <section className={this.state.isActive == false ? `${styles.section}` : `${styles.section} ${styles.active}`}>
                <div className={`${styles.formContainer} ${styles.signUp}`}>
                    <h3>Вход</h3>
                    <div className={styles.socialLinks}>
                        <a href="#"><i className="fa-brands fa-google"></i></a>
                        <a href="#"><i className="fa-brands fa-vk"></i></a>
                        <a href="#"><i className="fa-brands fa-github"></i></a>
                    </div>
                    <form onSubmit={
                        (ev) => {
                            ev.preventDefault();
                            this.setState({
                                isLoading: true
                            });
                            this.checkUser();
                        }
                    }>
                        <div className={styles.placeholderContainer}>
                            <input
                                ref={this.inputLoginEmailRef}
                                type="text"
                                placeholder=" "
                                required
                                autoComplete="email"
                            />
                            <label>Email</label>
                        </div>
                        <div className={styles.placeholderContainer}>
                            <input
                                ref={this.inputLoginPasswordRef}
                                type="password"
                                placeholder=" "
                                required
                                autoComplete="current-password"
                            />
                            <label>Пароль</label>
                            </div>
                            <div className={styles.userMessage}>
                                <p>{this.state.errorLoginMessage}</p>
                            </div>
                            {this.state.isLoading ? 
                                <LoadingBlock theme="dark" />
                                :
                            null
                            }
                        <button className="btnDark" type="submit">Войти</button>
                        <button className={styles.mobileChangeBtn} onClick={(ev) => {
                            ev.preventDefault();
                            this.setState({
                                isActive: true
                            })
                        }}>Нет нашего аккаунта? <span style={{ textDecoration: "underline" }}>Зарегестрироваться</span></button>
                    </form>
                </div>
                <div className={`${styles.formContainer} ${styles.signIn}`}>
                    <h3>Регистрация</h3>
                    <div className={styles.socialLinks}>
                        <a href="#"><i className="fa-brands fa-google"></i></a>
                        <a href="#"><i className="fa-brands fa-vk"></i></a>
                        <a href="#"><i className="fa-brands fa-github"></i></a>
                    </div>
                    <form onSubmit={(ev) => {
                            ev.preventDefault();
                            this.setState({
                                isLoading: true
                            });
                        this.registration();
                    }}>
                        <div className={styles.placeholderContainer}>
                            <input
                                ref={this.inputRegLoginRef}
                                type="text"
                                placeholder=" "
                                required
                                autoComplete="username"
                            />
                            <label>Логин</label>
                        </div>
                        <div className={styles.placeholderContainer}>
                            <input
                                ref={this.inputRegEmailRef}
                                type="text"
                                placeholder=" "
                                required
                                autoComplete="email"
                            />
                            <label>Email</label>
                        </div>
                        <div className={styles.placeholderContainer}>
                            <input
                                ref={this.inputRegPasswordRef}
                                type="password"
                                placeholder=" "
                                required
                                autoComplete="new-password"
                                minLength="6"
                                maxLength="20"
                            />
                            <label>Пароль</label>
                            </div>

                            <div className={styles.userMessage}>
                                <p>{this.state.errorRegMessage}</p>
                            </div>
                            {this.state.isLoading ?
                                <LoadingBlock theme="dark"/>
                                :
                                null
                            }
                        <button className="btnDark" type="submit">Зарегестрироваться</button>
                        <button className={styles.mobileChangeBtn} onClick={(ev) => {
                            ev.preventDefault();
                            this.setState({
                                isActive: false
                            })
                        }}>Есть аккаунт? <span style={{ textDecoration:"underline" }}>Войти</span></button>
                    </form>
                </div>


                <div className={styles.textContainer}>
                    <div className={styles.textPanel}>
                        <p className={styles.hello}>С возвращением</p>
                        <p className={styles.description}>Войдите, чтобы увидеть ваши проекты</p>
                        <button onClick={() => {
                            this.setState({
                                isActive: true
                            });
                        }}>Войти</button>
                    </div>
                    <div className={styles.textPanel}>
                        <p className={styles.hello}>Добро пожаловать на наш сервис</p>
                        <p className={styles.description}>Зарегестрируйтесь, чтобы использовать наш сервис</p>

                            <button onClick={() => {
                            this.setState({
                                isActive: false
                            })

                        }}>Зарегестрироваться</button>
                    </div>
                </div>
                </section>
            </>

        );
    }


    //Work with HTTP response functions
    async checkUser() {

        const response = await fetch('user/check?'
            + 'email=' + this.inputLoginEmailRef.current.value
            + '&password=' + this.inputLoginPasswordRef.current.value);
        if (response.status == 200) {

            const data = await response.json();
            console.log(data);
            if (data.item1) {
                const cookies = new Cookies();
                cookies.set('userId', data.item3.id, { path: '/', maxAge: 86400 });
                cookies.set('userImage', data.item3.imgUrl, { path: '/', maxAge: 86400 });
                cookies.set('userName', data.item3.login, { path: '/', maxAge: 86400 });

                this.setState({
                    toProjectList: true
                });
            }
            else {
                this.setState({
                    errorLoginMessage: data.item2,
                    isLoading: false
                });
            }
        } else {
            this.setState({
                errorLoginMessage: "Ошибка при получении данных! Попробуйте позже",                
                isLoading: false
            });
        }

    }

    async registration() {

        const response = await fetch('user/add?email='
            + this.inputRegEmailRef.current.value
            + '&password=' + this.inputRegPasswordRef.current.value
            + '&login=' + this.inputRegLoginRef.current.value

        );
        if (response.status == 200) {

            const data = await response.json();
            console.log(data);

            if (data.item1) {
                const cookies = new Cookies();
                cookies.set('userId', data.item3.id, { path: '/', maxAge: 86400 });
                cookies.set('userImage', data.item3.imgUrl, { path: '/', maxAge: 86400 });
                cookies.set('userName', data.item3.login, { path: '/', maxAge: 86400 });

                this.setState({
                    toProjectList: true
                });
            }
            else {
                this.setState({
                    errorRegMessage: data.item2,
                    isLoading: false
                });
            }
        } else {
            this.setState({
                errorRegMessage: "Ошибка при получении данных! Попробуйте позже",
                isLoading: false
            });
        }
    }
}