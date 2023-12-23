import React, { Component } from 'react';
import { LoadingBlock } from '../../LoadingBlock';
import { NavMenu } from '../../NavMenu';

import styles from '../../../public/css/projectPage.module.css';

export default class ProjectSettingModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            project: props.project,
            projectImage: props.project.imageUrl,
            isLoadingUsers: true,
            projectUsers: null,
            userId: props.userId,
            removeUser: false
        };

        this.inputUserEmailRef = React.createRef();

        this.inputTitleRef = React.createRef();
        this.inputDescriptionRef = React.createRef();

        this.closeSettings = props.closeSettings;
    }


    //Item life cycle
    componentDidMount() {

        this.getProjectUsers();
    }


    //Render functions
    render() {
        return (
            <div className={`modal active`} >
                <div className="fadeBack"></div>
                <div className={`modal-content ${styles.modalProjectSetting}`}>
                    <div className="header">
                        <button onClick={(ev) => {
                            this.closeSettings();
                        }}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <p>Настройки</p>
                    </div>
                    <div className={styles.mainSetting}>
                        <h2>Основные настройки</h2>
                        <div className={styles.textContainer}>
                            <div className={styles.textInput}>
                                <label>Название</label>
                                <input ref={this.inputTitleRef}
                                    type="text"
                                    placeholder="Название области"
                                    defaultValue={this.state.project.title} />
                            </div>
                            <div className={styles.textInput}>
                                <label>Описание</label>
                                <textarea
                                    ref={this.inputDescriptionRef}
                                    placeholder="Описание области"
                                    defaultValue={this.state.project.description}
                                />
                            </div>
                        </div>
                        <div className={styles.imageContainer}>
                            <div className={styles.textInput}>
                                <label>Изображение</label>
                                <input onChange={(ev) => {
                                    this.setState({
                                        projectImage: ev.target.value
                                    });
                                }} type="url"
                                    placeholder="URl"
                                    defaultValue={this.state.projectImage} />
                            </div>
                            <img src={this.state.projectImage} />
                        </div>
                        <button onClick={async (ev) => {
                            await this.updateProject();
                        }} className={`btnDark ${styles.btnDark}`}>Сохранить</button>
                    </div>
                    <div className={styles.usersSetting}>
                        <h2>Настройки пользователей</h2>
                        {this.state.isLoadingUsers ?
                            <LoadingBlock />
                            :
                            <>

                                <form>
                                    <input ref={this.inputUserEmailRef} type="text" placeholder="Email" />
                                    <button className={`btnDark ${styles.btnDark}`} onClick={(ev) => {
                                        ev.preventDefault();
                                        this.addUserInProject();
                                    }}>Добавить</button>
                                </form>
                                {this.state.projectUsers.map((item, key) => {
                                    return (<div key={key} className={styles.userList}>
                                        <div className={styles.userBlock}>
                                            <img src={item.imgUrl} />
                                            <p className={styles.login}>{item.login}</p>
                                            <p className={styles.email}>{item.email}</p>
                                            {this.state.userId == item.id ?
                                                <button onClick={() => {
                                                    if (this.state.removeUser) {
                                                        this.removeUser();
                                                    }
                                                    else {
                                                        alert("Еще раз сюда нажмешь, удалю твой акк");
                                                        this.setState({
                                                            removeUser: true
                                                        });
                                                    }
                                                }}>
                                                    <i className="fa-solid fa-heart fa-bounce " style={{ color: "#ff0000" }}></i>
                                                </button>
                                                :
                                                <button onClick={() => {
                                                    this.removeUserInProject(item.id);
                                                }}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            }
                                        </div>
                                    </div>);
                                })}

                            </>
                        }
                    </div>
                    <div className={styles.otherSetting}>
                        <h2>Дополнительные настройки</h2>
                        <button onClick={async (ev) => {
                            if (window.confirm("Это действие нельзя отменить")) {
                                await this.removeProject();
                            }
                        }} className={`btnDark ${styles.btnDark} ${styles.btnWarn}`}>Удалить область</button>
                    </div>
                </div>
            </div>
        );
    }


    //Work with HTTP response functions
    async getProjectUsers() {

        const response = await fetch('project/getusers?id=' + this.state.project.id);
        const data = await response.json();
        this.setState({
            projectUsers: data,
            isLoadingUsers: false
        });

    }
    async addUserInProject() {

        await fetch('project/adduser?projectId=' + this.state.project.id
            + '&email=' + this.inputUserEmailRef.current.value
        );
        this.setState({
            isLoadingUsers: true
        });
        this.getProjectUsers();

    }
    async removeUserInProject(userId) {

        await fetch('project/removeuser?projectId=' + this.state.project.id
            + '&userId=' + userId
        );
        this.setState({
            isLoadingUsers: true
        });
        this.getProjectUsers();
    }


    async updateProject() {

        await fetch('project/update?id=' + this.state.project.id
            + '&title=' + this.inputTitleRef.current.value
            + (this.inputDescriptionRef.current.value != "" ? '&description=' + this.inputDescriptionRef.current.value : "")
            + '&imageUrl=' + this.state.projectImage
        );

        this.closeSettings();
    }
    async removeProject() {

        await fetch('project/remove?id=' + this.state.project.id);
        window.location.reload();
    }

    async removeUser() {
        await fetch('/user/remove?id=' + this.state.userId);
        NavMenu.logoutUser();
    }
}