import React, { Component } from 'react';
import styles from '../../../public/css/projectPage.module.css';
import { TaskContextMenu } from '../../TaskContextMenu';
import { TaskSettingModal } from '../../TaskSettingModal';


export default class TaskBlock extends Component {

    constructor(props) {
        super(props);

        this.state = {
            task: props.task,
            viewSetting: false,
            taskDate: props.task.endDate,
            parent: props.parent
        };

        this.inputTitle = React.createRef();

        this.onDragEnd = props.onDragEnd;
        this.onDragEnter = props.onDragEnter;
        this.onDragStart = props.onDragStart;

        this.updateTaskList = props.updateTaskList;
        this.openSetting = this.openSetting.bind(this);
        this.removeTask = this.removeTask.bind(this);
        this.completeTask = this.completeTask.bind(this);
        this.uncompleteTask = this.uncompleteTask.bind(this);

        this.closeSettings = this.closeSettings.bind(this);
        this.getTaskStatusClass = this.getTaskStatusClass.bind(this);

        this.currentRef = React.createRef();
    }


    //Update state functions
    openSetting() {
        TaskContextMenu.disableContextMenu();
        this.setState({
            viewSetting: true
        });
    }
    closeSettings() {

        this.setState({
            viewSetting: false
        });
        TaskSettingModal.disableModal();
        try {
            this.updateTaskList();
        }
        catch (ex) {
            console.log(ex);
        }
    }


    //Render functions
    render() {
        if (this.state.viewSetting) {
            TaskSettingModal.activeModal(this.state.task, this.closeSettings);
        }
        return (
            <div
                ref={this.currentRef}
                draggable="true"
                onDragStart={(ev) => {
                    if (!this.onDragStart(this.currentRef.current, this.state.task.id, "task", this.state.parent)) {
                        ev.preventDefault();
                    }
                }}
                onDragEnter={(ev) => {
                    this.onDragEnter(this.currentRef.current, this.state.task.id, this.state.parent);


                }}
                onDragEnd={async (ev) => {
                    await this.onDragEnd();
                }}
            >
                <button
                    onContextMenu={(ev) => {
                        ev.preventDefault();
                        TaskContextMenu.activeContextMenu(
                            this.state.task,
                            {
                                onCompleteClick: this.completeTask,
                                onUncompleteClick: this.uncompleteTask,
                                onUpdateClick: this.openSetting,
                                onRemoveClick: this.removeTask,
                            },
                            true,
                            ev
                        );
                    }}
                    onDoubleClick={(ev) => {

                        this.openSetting();
                    }}
                    className={`${styles.task} ${this.getTaskStatusClass()} `}>
                    <p>{this.state.task.title}</p>
                </button>
            </div>
        );
    }
    //Helping method
    getTaskStatusClass() {
        if (this.state.task.taskStatus === 0) {
            return styles.complete;
        }

        if (this.state.taskDate != null
            && Date.now() > Date.parse(this.state.taskDate)
        ) {
            return styles.overdue;
        }
        return "";
    }


    //Work with HTTP response functions
    async removeTask() {

        TaskContextMenu.disableContextMenu();

        await fetch('task/remove?'
            + "id=" + this.state.task.id
        );
        this.updateTaskList();
    }
    async completeTask() {

        TaskContextMenu.disableContextMenu();

        await fetch('task/complete?'
            + "id=" + this.state.task.id
        );
        this.updateTaskList();
    }
    async uncompleteTask() {

        TaskContextMenu.disableContextMenu();

        await fetch('task/uncomplete?'
            + "id=" + this.state.task.id
        );
        this.updateTaskList();
    }
}