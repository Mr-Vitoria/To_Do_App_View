import React, { Component } from 'react';
import ProjectBlock from './components/projectBlock';
import ProjectSettingModal from './components/projectSettingModal';
import styles from '../../public/css/projectList.module.css';
import { LoadingBlock } from '../LoadingBlock';

export default class ProjectListPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectList: null,
            isLoading: true,
            userId: props.userId,
            activeProject: null,
            viewSetting: false
        };

        this.changeProjectPage = props.changeProjectPage;

        this.closeSettings = this.closeSettings.bind(this);
        this.openSettings = this.openSettings.bind(this);

        this.updateProjectList = this.updateProjectList.bind(this);

        this.inputTitleRef = React.createRef();

    }


    //Item life cycle
    componentDidMount() {

        this.getProjects();
    }


    //Update state functions
    closeSettings() {

        this.setState({
            viewSetting: false
        });
        this.updateProjectList();
    }
    openSettings(project) {

        this.setState({
            viewSetting: true,
            activeProject: project
        });
    }

    updateProjectList() {

        this.setState({
            isLoading: true,
            projectList: null
        });
        this.getProjects();
    }


    //Render functions
    renderModel(projectList) {
        return (
            <>
                {this.state.viewSetting ?
                    <ProjectSettingModal
                        closeSettings={this.closeSettings}
                        project={this.state.activeProject}
                        userId={this.state.userId}
                    />
                    :
                    null
                }
                <section className={styles.projectListSection}>
                    <h2>Рабочие области</h2>
                    <div className={styles.projectListContainer}>
                        {
                            projectList.map((item, key) =>

                                <ProjectBlock
                                    openSettings={this.openSettings}
                                    changeProjectPage={this.changeProjectPage}
                                    project={item}
                                    key={key}
                                />
                            )
                        }

                        <div className={`${styles.card} ${styles.projectAddCard}`}>
                            <div className={styles.front}>
                                <div className={styles.container}>
                                    <i className="fa-solid fa-plus"></i>
                                </div>
                            </div>
                            <div className={styles.back}>
                                <form onSubmit={(ev) => {
                                    ev.preventDefault();
                                    this.addProject();
                                }}>
                                    <input placeholder="Название" type="text" ref={this.inputTitleRef} required />
                                    <button type="submit">Добавить</button>
                                </form>
                            </div>
                        </div>
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
                this.renderModel(this.state.projectList);
        return (
            <>
                {content}
            </>
        );
    }


    //Work with HTTP response functions
    async getProjects() {

        const response = await fetch('project/getlist?userId=' + this.state.userId);
        const data = await response.json();

        this.setState({
            projectList: data,
            isLoading: false
        });

    }
    async addProject() {

        await fetch('project/add?title=' + this.inputTitleRef.current.value
            + '&userId=' + this.state.userId
        );
        this.updateProjectList();

    }
}