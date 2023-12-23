import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { Layout } from '../Layout';
import ProjectListPage from './projectListPage.js';
import ProjectPage from './projectPage.js';

export class ProjectListContainer extends Component {
    static displayName = ProjectListContainer.name;

    constructor(props) {
        super(props);

        this.inputLoginEmailRef = React.createRef();
        this.inputLoginPasswordRef = React.createRef();

        Layout.changeNeedMenu(true);

        let userId = -1;
        const cookies = new Cookies();
        if (cookies.get('userId') != null) {
            userId = cookies.get('userId');
        }


        this.state = {
            isActive: false,
            userId: userId,
            isLoading: true,
            projects: null,
            page: userId == -1 ? "Auth" :"List"
        }


        this.changeProjectPage = this.changeProjectPage.bind(this);
        this.backToListPage = this.backToListPage.bind(this);
    }


    changeProjectPage(project) {

        this.setState({
            page: "Project",
            project: project
        });
    }
    backToListPage() {

        this.setState({
            page: "List"
        });
    }

    render() {
        switch (this.state.page) {
            case "Auth":
                return <Navigate to='/auth' />;
            case "Project":
                return <ProjectPage project={this.state.project} backToListPage={this.backToListPage} />;

            default:
                return <ProjectListPage changeProjectPage={this.changeProjectPage} userId={this.state.userId} />;
        }
    }
}