import React, { Component } from 'react';
import styles from '../public/css/projectPage.module.css';

export class TaskSettingModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            task: null,
            closeEvent: null,
            isActive: false
        };


        this.inputTitleRef = React.createRef();
        this.inputDateRef = React.createRef();
        this.inputDescriptionRef = React.createRef();

        this.updateTask = this.updateTask.bind(this);


        TaskSettingModal.activeModal = this.activeModal.bind(this);
        TaskSettingModal.disableModal = this.disableModal.bind(this);


    }
    activeModal(task, closeEvent) {
        this.setState({
            task: task,
            closeEvent: closeEvent,
            isActive: true
        });

        this.inputDateRef.current.value = (task.endDate != null ? new Date(task.endDate).toISOString().slice(0, -2) : "");
    }
    disableModal() {
        this.setState({
            isActive: false,
            task: null,
            closeEvent: null
        });
    }
    //Render function
    render() {
        return (  
            <div className={`modal ${this.state.isActive ? "active" : ""}`} >
                <div className="fadeBack"></div>
                <div className={`modal-content ${styles.modalTaskSetting}`}>
                    <div className="header">
                        <button onClick={(ev) => {
                            this.state.closeEvent();
                        }}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <p>Настройки</p>
                    </div>
                    <div className={styles.taskSettingBody}>
                        <div className={styles.optionContainer}>
                            <label><i className="fa-solid fa-feather-pointed"></i>Название</label>
                            <input
                                defaultValue={this.state.task != null ? this.state.task.title : ""}
                                ref={this.inputTitleRef}
                                placeholder="Название" />
                        </div>
                        <div className={styles.optionContainer}>
                            <label><i className="fa-brands fa-readme"></i>Описание</label>
                            <textarea
                                defaultValue={this.state.task != null ? this.state.task.description : ""}
                                ref={this.inputDescriptionRef}
                                placeholder="Более подробно опишите задачу" />
                        </div>
                        <div className={styles.optionContainer}>
                            <div className={styles.dateContainer}>
                                <label><i className="fa-solid fa-calendar-days"></i>Дата создания</label>
                                <input
                                    type='date'
                                    defaultValue={this.state.task != null ? this.state.task.createdDate : ""}
                                    placeholder="Дата создания задачи"
                                    readOnly={true} />
                            </div>
                            <div className={styles.dateContainer}>
                                <label><i className="fa-solid fa-calendar-check"></i>Сроком до</label>
                                <input
                                    type='datetime-local'
                                    defaultValue={this.state.task != null ?
                                        this.state.task.endDate != null ? new Date(this.state.task.endDate).toISOString().slice(0, -2) : null
                                        : null
                                    }
                                    ref={this.inputDateRef}
                                    placeholder="Срок окончания" />
                            </div>
                        </div>

                        <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                            <button onClick={(ev) => {
                                this.updateTask();
                            }} className={`btnDark ${styles.btnDark}`}>Сохранить</button>
                        </div>
                    </div>
                </div>
                </div>
        );
    }


    //Work with HTTP response functions
    async updateTask() {

        await fetch('task/update?title=' + this.inputTitleRef.current.value
            + "&id=" + this.state.task.id
            + (this.inputDateRef.current.value != "" ? "&endDate=" + this.inputDateRef.current.value : "")
            + "&description=" + this.inputDescriptionRef.current.value
        );

        this.state.closeEvent();

    }
}