import React, { Component } from 'react';
import TaskBlock from './taskBlock';
import styles from '../../../public/css/projectPage.module.css';
import { LoadingBlock } from '../../LoadingBlock';
import GroupSettingModal from './groupSettingModal';
import { TaskGroupContextMenu } from '../../TaskGroupContextMenu';

export default class TaskGroupBlock extends Component {

    constructor(props) {
        super(props);

        this.state = {
            taskGroup: props.taskGroup,
            taskList: null,
            loadTaskList: false,
            addTask: false,
            viewSetting: false
        };

        this.inputTitleRef = React.createRef();
        this.currentRef = React.createRef();

        this.updateTaskGroupList = props.updateTaskGroupList;
        this.updateTaskList = this.updateTaskList.bind(this);

        this.onDragEnd = props.onDragEnd;
        this.onDragEnterGroup = props.onDragEnterGroup;
        this.onDragEnterTask = props.onDragEnterTask;
        this.onDragStart = props.onDragStart;


        this.openSetting = this.openSetting.bind(this);
        this.removeTaskGroup = this.removeTaskGroup.bind(this);

        this.closeSettings = this.closeSettings.bind(this);

    }

    //Item life cycle
    componentDidMount() {
        this.getGroupTasks();
    }


    //Update state functions
    openSetting() {

        this.setState({
            viewSetting: true
        });
        TaskGroupContextMenu.disableContextMenu();
    }
    closeSettings() {

        this.setState({
            viewSetting: false
        });
    }
    updateTaskList() {

        this.setState({
            loadTaskList: false,
            taskList: null
        });
        this.getGroupTasks();
    }


    //Render functions
    render() {

        return (
            <div
                ref={this.currentRef}
                className={styles.taskGroup}
                draggable="true"
                onDragStart={(ev) => {
                    if (ev.target != this.currentRef.current) {
                        return;
                    }
                    if (!this.onDragStart(this.currentRef.current, this.state.taskGroup.id, "group")) {
                        ev.preventDefault();
                    }
                }}
                onDragEnterCapture={(ev) => {
                    this.onDragEnterGroup(this.currentRef.current, this.state.taskGroup.id);
                }}
                onDragEnd={async (ev) => {
                    await this.onDragEnd();
                }}
                onContextMenu={(ev) => {
                    ev.preventDefault();
                    if (ev.target.classList.contains(styles.taskGroup)
                        || ev.target.classList.contains(styles.taskGroupHeader)
                    ) {
                        TaskGroupContextMenu.activeContextMenu(
                            this.state.taskGroup,
                            {
                                onUpdateClick: this.openSetting,
                                onRemoveClick: this.removeTaskGroup,
                            },
                            true,
                            ev
                        );
                    }
                }}
                onDoubleClickCapture={(ev) => {
                    if (ev.target.classList.contains(styles.taskGroup)
                        || ev.target.classList.contains(styles.taskGroupHeader)
                    ) {
                        this.openSetting();
                    }
                }}
            >

                {this.state.viewSetting ?
                    <GroupSettingModal
                        closeSettings={this.closeSettings}
                        group={this.state.taskGroup}
                        updateTaskGroupList={this.updateTaskGroupList}
                    />
                    :
                    null
                }
                <div
                    className={styles.taskGroupHeader}
                >
                    <p>{this.state.taskGroup.title}</p>
                    <button className="btnOpenSetting" onClick={(ev) => {
                        ev.preventDefault();
                        TaskGroupContextMenu.activeContextMenu(
                            this.state.taskGroup,
                            {
                                onUpdateClick: this.openSetting,
                                onRemoveClick: this.removeTaskGroup,
                            },
                            true,
                            ev
                        );
                    }}><i className="fa-solid fa-ellipsis"></i></button>
                </div>
                <div className={styles.taskGroupBody}>
                    {
                        this.state.loadTaskList && this.state.taskList ?
                            this.state.taskList.map((item, key) => {
                                return <TaskBlock
                                    key={key}
                                    task={item}
                                    onDragStart={this.onDragStart}
                                    onDragEnter={this.onDragEnterTask}
                                    onDragEnd={this.onDragEnd}
                                    updateTaskList={this.updateTaskList}
                                    parent={this.currentRef.current}
                                />
                            })

                            :
                            <div style={{ width: "100%", display: 'flex', justifyContent: 'center' }}>
                                <LoadingBlock />
                            </div>
                    }
                </div>

                <div className={styles.taskGroupFooter}>
                    {
                        this.state.addTask
                            ?
                            <form onSubmit={(ev) => {
                                ev.preventDefault();
                                this.addTask();
                            }}>
                                <textarea autoFocus={true} ref={this.inputTitleRef} />
                                <div className={styles.linksContainer}>
                                    <button type="submit">Добавить задачу</button>
                                    <button onClick={(ev) => {
                                        ev.preventDefault();
                                        this.setState({
                                            addTask: false
                                        });
                                    }}><i className="fa-solid fa-xmark"></i></button>
                                </div>
                            </form>
                            :
                            <button className={styles.btnFull} onClick={(ev) => {
                                this.setState({
                                    addTask: true
                                });
                            }}><i className="fa-solid fa-plus"></i><p>Добавить задачу</p></button>
                    }
                </div>
            </div>
        );
    }


    //Work with HTTP response functions
    async removeTaskGroup() {

        TaskGroupContextMenu.disableContextMenu();

        await fetch('taskgroup/remove?'
            + "id=" + this.state.taskGroup.id
        );
        this.updateTaskGroupList();
    }


    async addTask() {

        await fetch('task/add?title=' + this.inputTitleRef.current.value +
            '&groupId=' + this.state.taskGroup.id
        );
        this.inputTitleRef.current.value = "";

        this.getGroupTasks();
    }
    async getGroupTasks() {

        let response = await fetch('task/getlist?groupId=' + this.state.taskGroup.id);
        let data = await response.json();

        this.setState({
            loadTaskList: true,
            taskList: data
        });

    }
}


