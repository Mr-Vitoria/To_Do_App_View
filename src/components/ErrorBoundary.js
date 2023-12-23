import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import styles from '../public/css/error.module.css';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            toMain: false
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.log(error);
        console.log(info);
    }

    render() {
        if (this.state.toMain) {
            this.setState({
                toMain: false,
                hasError: false
            });
            return <Navigate to='/' replace={true} />;
        }
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <div className={styles.errorBox} >
                <h1 >Что-то пошло не так</h1>
                <h2 >Попробуйте еще раз, через некоторое время</h2>
                <button onClick={(ev) => {
                    this.setState({
                        toMain: true
                    });
                }}>На главную</button>
            </div>;
        }

        return this.props.children;
    }
}