import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '../Layout';
import { LoadingWindow } from '../LoadingWindow';
import Cookies from 'universal-cookie';

import styles from '../../public/css/main.module.css';


export class MainPageContainer extends Component {
    static displayName = MainPageContainer.name;

    constructor(props) {
        super(props);

        Layout.changeNeedMenu(false);

        let userId = -1;
        const cookies = new Cookies();
        if (cookies.get('userId') != null) {
            userId = cookies.get('userId');
        }


        this.state = {
            userId: userId,
            page: userId != -1 ? "List" : "Main"
        }
        try {
        LoadingWindow.openWindow();
        }
        catch (ex) {
            console.log(ex);
        }
    }


    componentDidMount() {
        LoadingWindow.closeWindow();
    }

    componentDidUpdate() {
        LoadingWindow.openWindow();
    }

    render() {

        switch (this.state.page) {
            case "List":
                return <Navigate to='/project' />;
            case "Auth":
                return <Navigate to='/auth' />;

            default:
                return (
                    <>
                    <div className={styles.mainSection}>
                        <section className={styles.header}>
                            <p>OuTouch</p>
                            <div className={styles.linkListContainer}>
                                <a href="https://vk.com/vitvis" target="_blank" className={styles.link}><i className="fa-brands fa-vk"></i></a>
                                <a href="https://github.com/Vit-Vi" target="_blank" className={styles.link}><i className="fa-brands fa-github"></i></a>
                            </div>
                        </section>
                        <section className={styles.sloganSection}>
                            <p className={styles.sloganMain}>Хаос в мыслях - проблемы в жизни</p>
                            <p className={styles.sloganDescription}>Забудьте о хаосе и держите все под контролем с нашим сервисом</p>
                            <button onClick={(ev) => {
                                this.setState({
                                    page: "Auth"
                                });
                            }}>Начать сейчас</button>
                        </section>

                        <section className={styles.aboutSection}>
                            <p className={styles.title}>Организуйте все с помощью одного сервиса</p>
                            <div className={styles.imgBlock}>
                                <img src={require('../../public/images/img_about_1.png')} alt="..." />
                                <p>Распределите ваши задачи между разными пространствами</p>
                            </div>
                            <div className={styles.imgBlock}>
                                <img src={require('../../public/images/img_about_2.png')} alt="..." />
                                <p>И настраивайте каждое пространство под себя</p>
                            </div>
                        </section>

                        <section className={styles.aiSection}>
                            <p className={styles.title}>Управляйте своими задачами с помощью голосового помощника</p>
                            <button onClick={(ev) => {
                                this.setState({
                                    page: "Auth"
                                });
                            }}>Начать сейчас</button>
                        </section>

                        <footer>
                            <div className={styles.serviceListContainer}>
                                <div className={styles.service}>
                                    <p className={styles.title}>OuTouch Anime</p>
                                    <a href="http://anime.outouch.ru/">Главная</a>
                                    <a href="http://anime.outouch.ru/Anime/AnimeList">Список аниме</a>
                                    <a href="http://anime.outouch.ru/User/Profile">Профиль</a>
                                    <a href="http://anime.outouch.ru/News/FAQ">FAQ</a>
                                </div>
                                <div className={styles.service}>
                                    <p className={styles.title}>OuTouch</p>
                                    <a href="http://outouch.ru/">Главная</a>
                                    <a href="http://outouch.ru/chill.html">Чилл</a>
                                    <a href="http://outouch.ru/developing.html">Игры</a>
                                    <a href="http://outouch.ru/developing.html">Форум</a>
                                </div>
                                <div className={styles.service}>
                                    <p className={styles.title}>OuTouch Films</p>
                                    <a href="http://films.outouch.ru/">Главная</a>
                                    <a href="http://films.outouch.ru/Films/filmList">Список фильмов</a>
                                    <a href="http://films.outouch.ru/User/Profile">Профиль</a>
                                    <a href="http://films.outouch.ru/News/FAQ">FAQ</a>
                                </div>
                            </div>
                            <p className={styles.copyright}>© 2023 - OuTouch</p>
                        </footer>
                    </div>
                </>
                );
        }
    }
}