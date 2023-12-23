import React, { Component } from 'react';

import styles from '../../../public/css/projectPage.module.css';

export default class GroupSettingModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            group: props.group,
            taskList: props.taskList
        };


        this.inputTitleRef = React.createRef();
        this.inputDescriptionRef = React.createRef();

        this.closeSettings = props.closeSettings;

        this.updateTaskGroup = this.updateTaskGroup.bind(this);

        this.updateTaskGroupList = props.updateTaskGroupList;
    }

    //Render functions
    render() {
        return (
            <div className={`modal active`} >
                <div className="fadeBack"></div>
                <div className={`modal-content ${styles.modalTaskGroupSetting}`}>
                    <div className="header">
                        <button onClick={(ev) => {
                            this.closeSettings();
                        }}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <p>Настройки</p>
                    </div>
                    <div className={styles.groupSettingBody}>
                        <div className={styles.optionContainer}>
                            <label><i className="fa-solid fa-feather-pointed"></i>Название</label>
                            <input
                                defaultValue={this.state.group.title}
                                ref={this.inputTitleRef}
                                placeholder="Название" />
                        </div>
                        <div className={styles.optionContainer}>
                            <label><i className="fa-brands fa-readme"></i>Описание</label>
                            <textarea
                                defaultValue={this.state.group.description}
                                ref={this.inputDescriptionRef}
                                placeholder="Опишите, для чего эта группа задач" />
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                            <button onClick={(ev) => {
                                this.updateTaskGroup();
                            }} className={`btnDark ${styles.btnDark}`}>Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    //Work with HTTP response functions
    async updateTaskGroup() {

        await fetch('taskgroup/update?'
            + "id=" + this.state.group.id
            + "&title=" + this.inputTitleRef.current.value
            + (this.inputDescriptionRef.current.value != "" ? "description=" + this.inputDescriptionRef.current.value : "")
        );
        this.updateTaskGroupList();
    }
}