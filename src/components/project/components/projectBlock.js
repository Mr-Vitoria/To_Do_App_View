import React, { Component } from 'react';
import styles from '../../../public/css/projectList.module.css';

export default class ProjectBlock extends Component {

    constructor(props) {
        super(props);

        this.state = {
            project: props.project
        };

        this.changeProjectPage = props.changeProjectPage;
        this.openSettings = props.openSettings;
    }


    //Render function
    render() {
        return (
            <div className={styles.card}>
                <div className={styles.front} style={{ backgroundImage: 'url("' + this.state.project.imageUrl + '")' }}>
                    <div className={styles.container}>
                        <p>{this.state.project.title}</p>
                    </div>
                </div>
                <div className={styles.back}>
                    <p>{this.state.project.title}</p>

                    <button onClick={() => {
                        this.changeProjectPage(this.state.project);
                    }}>
                        Открыть
                    </button>
                    <button onClick={() => {
                        this.openSettings(this.state.project);
                    }}>
                        Изменить
                    </button>
                </div>
            </div>
        );
    }
}