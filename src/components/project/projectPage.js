import React, { Component } from 'react';
import ProjectSettingModal from './components/projectSettingModal';
import TaskGroupBlock from './components/taskGroupBlock';
import styles from '../../public/css/projectPage.module.css';
import { LoadingBlock } from '../LoadingBlock';

export default class ProjectPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            project: props.project,
            projectTaskGroups: null,
            viewSetting: false,
            addTaskGroup: false,
            dragableItem: null,
            dragableId: -1,
            dragableEnterId: -1,
            dragableEnterGroupId: -1,
            dragableType: "",
            dragableParent: null
        };

        this.backToListPage = props.backToListPage;

        this.inputTitleProjectRef = React.createRef();
        this.inputTitleNewGroupRef = React.createRef();

        this.groupListRef = React.createRef();


        this.closeSettings = this.closeSettings.bind(this);
        this.updateTaskGroupList = this.updateTaskGroupList.bind(this);
        this.changeGroupPosition = this.changeGroupPosition.bind(this);
        this.changeTaskPosition = this.changeTaskPosition.bind(this);

        this.onDragStart = this.onDragStart.bind(this);
        this.onDragEnterGroup = this.onDragEnterGroup.bind(this);
        this.onDragEnterTask = this.onDragEnterTask.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);

    }


    //Item life cycle
    componentDidMount() {

        this.getProjectTaskGroups();
    }


    //Update state functions
    closeSettings() {

        this.setState({
            viewSetting: false
        });
    }
    openSettings() {

        this.setState({
            viewSetting: true
        });
    }

    updateTaskGroupList() {

        this.setState({
            isLoading: true,
            projectTaskGroups: null
        });
        this.getProjectTaskGroups();
    }

    //Dragable functions
    onDragStart(item, id, type, dragableParent) {
        if (this.state.dragableItem != null) {
            return false;
        }


        this.setState({
            dragableItem: item,
            dragableId: id,
            dragableType: type,
            dragableParent: dragableParent
        });
        return true;
    }
    onDragEnterGroup(itemEnter, id) {
        try {
            if (this.state.dragableType == "group" && this.state.dragableItem != itemEnter) {
                itemEnter.parentNode.insertBefore(this.state.dragableItem
                    , itemEnter.nextElementSibling != this.state.dragableItem ? itemEnter.nextElementSibling : itemEnter);
                this.setState({
                    dragableEnterId: id
                });
            }

            if (this.state.dragableType == "task"
                && this.state.dragableParent != null
                && this.state.dragableParent != itemEnter
            ) {
                itemEnter.getElementsByClassName(styles.taskGroupBody)[0].appendChild(this.state.dragableItem);
                this.setState({
                    dragableEnterId: -1,
                    dragableEnterGroupId: id
                });
            }

        }
        catch (ex) {
            console.log(ex);
        }
    }
    onDragEnterTask(itemEnter, id, parentNode) {

        try {
            if (this.state.dragableType == "task" && this.state.dragableItem != itemEnter) {
                itemEnter.parentNode.insertBefore(this.state.dragableItem
                    , itemEnter.nextElementSibling != this.state.dragableItem ? itemEnter.nextElementSibling : itemEnter);
                this.setState({
                    dragableEnterId: id,
                    dragableParent: parentNode
                });
            }

        }
        catch (ex) {
            console.log(ex);
        }
    }
    async onDragEnd() {

        if (this.state.dragableId >= 0
            && (this.state.dragableEnterId >= 0 || this.state.dragableEnterGroupId >= 0)
            && this.state.dragableId != this.state.dragableEnterId) {
            switch (this.state.dragableType) {
                case "group":
                    await this.changeGroupPosition(this.state.dragableId, this.state.dragableEnterId);
                    break;
                case "task":
                    await this.changeTaskPosition(this.state.dragableId, this.state.dragableEnterId, this.state.dragableEnterGroupId);
                    break;
            }

        }
        this.setState({
            dragableItem: null,
            dragableId: -1,
            dragableEnterId: -1,
            dragableEnterGroupId: -1,
            dragableType: "",
            dragableParent: null
        });


    }


    //Render functions
    renderModel(project, projectTaskGroups) {
        return (
            <>

                {this.state.viewSetting ?
                    <ProjectSettingModal closeSettings={this.closeSettings} project={this.state.project} />
                    :
                    null
                }
                <section className={styles.section}>

                    <div className={styles.header}>

                        <button onClick={
                            (ev) => {
                                this.backToListPage();
                            }
                        }>
                            <i className="fa-solid fa-arrow-left-long"></i>
                        </button>
                        <h2>{project.title}</h2>
                        <button onClick={(ev) => {
                            this.setState({
                                viewSetting: true
                            });
                        }}>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                    </div>
                    <div ref={this.groupListRef} className={styles.taskGroupList}>

                        {
                            projectTaskGroups.map((item, key) => {
                                return <TaskGroupBlock
                                    taskGroup={item}
                                    key={key}
                                    updateTaskGroupList={this.updateTaskGroupList}
                                    onDragStart={this.onDragStart}
                                    onDragEnterTask={this.onDragEnterTask}
                                    onDragEnterGroup={this.onDragEnterGroup}
                                    onDragEnd={this.onDragEnd}
                                    addArrayUpdate={this.addArrayUpdate}
                                />
                            })}
                        {this.state.addTaskGroup ?
                            <form onSubmit={(ev) => {
                                ev.preventDefault();
                                this.addTaskGroup();
                            }} className={styles.addGroupForm}>
                                <input autoFocus={true } placeholder="Название группы" ref={this.inputTitleNewGroupRef} />
                                <div className={styles.linksContainer}>

                                    <button type="submit">Добавить группу</button>
                                    <button onClick={(ev) => {
                                        ev.preventDefault();
                                        this.setState({
                                            addTaskGroup: false
                                        });
                                    }}><i className="fa-solid fa-xmark"></i></button>
                                </div>
                            </form>
                            :
                            <button onClick={(ev) => {
                                this.setState({
                                    addTaskGroup: true
                                });
                            }} className={styles.btnAddTaskGroup}><i className="fa-solid fa-plus"></i>Добавить группу</button>
                        }
                    </div>

                </section>
            </>
        );
    }

    render() {
        let content =
            this.state.isLoading ?
                <LoadingBlock />
                :
                this.renderModel(this.state.project, this.state.projectTaskGroups);
        return (
            <>
                {content}
            </>
        );
    }


    //Work with HTTP response functions
    async changeGroupPosition(groupIdOld, groupIdNew) {

        await fetch('taskgroup/changeposition?idOld=' + groupIdOld
            + '&idNew=' + groupIdNew
        );
    }
    async changeTaskPosition(idOld, idNew, idGroup) {
        await fetch('task/changeposition?idOld=' + idOld
            + '&idNew=' + idNew
            + '&idGroup=' + idGroup
        );
    }
    async getProjectTaskGroups() {

        const response = await fetch('taskgroup/getlist?projectId=' + this.state.project.id);

        const data = await response.json();
        this.setState({
            projectTaskGroups: data,
            isLoading: false
        });

    }
    async addTaskGroup() {

        await fetch('taskgroup/add?projectId=' + this.state.project.id
            + '&title=' + this.inputTitleNewGroupRef.current.value
        );

        await this.updateTaskGroupList();
    }


    async addTask() {

        const response = await fetch('task/addtask?projectId=' + this.state.project.id);
        const data = await response.json();

        let projectTaskGroups = this.state.projectTaskGroups;
        projectTaskGroups.push(data);
        this.setState({
            projectTaskGroups: projectTaskGroups
        });
    }
}