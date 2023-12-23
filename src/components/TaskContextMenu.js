import React, { Component } from 'react';
import styles from '../public/css/contextMenu.module.css';
import { TaskGroupContextMenu } from './TaskGroupContextMenu';


export class TaskContextMenu extends Component {
    static displayName = TaskContextMenu.name;

    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            posX: -1,
            posY: -1,
            task: null,
            btnEvents: {
                onUpdateClick: null,
                onRemoveClick: null,
                onUncompleteClick: null,
                onCompleteClick: null
            }
        };
        TaskContextMenu.activeContextMenu = this.activeContextMenu.bind(this);
        TaskContextMenu.disableContextMenu = this.disableContextMenu.bind(this);


        this.onMouseClick = this.onMouseClick.bind(this);

        this.currentElementRef = React.createRef();

        this.getPosition = this.getPosition.bind(this);
    }

    getPosition(mouseEvent) {
        let posX = 0;
        let posY = 0;

        if (mouseEvent.pageX || mouseEvent.pageY) {
            posX = mouseEvent.pageX;
            posY = mouseEvent.pageY;
        } else if (mouseEvent.clientX || mouseEvent.clientY) {
            posX = mouseEvent.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            posY = mouseEvent.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }

        return {
            x: posX,
            y: posY
        }
    }

    activeContextMenu(task, btnEvents, isActive, mouseEvent) {
        TaskGroupContextMenu.disableContextMenu();

        let position = this.getPosition(mouseEvent);
        this.setState({
            task: task,
            btnEvents: btnEvents,
            isActive: isActive,
            posX: position.x,
            posY: position.y
        });

        console.log(task);

        document.addEventListener('click', this.onMouseClick);
    }
    onMouseClick(ev) {

        if (!ev.target.classList.contains("btnOpenSetting") &&
            !ev.target.parentNode.classList.contains("btnOpenSetting") &&
            ev.target != this.currentElementRef.current &&
            ev.target.parentNode != this.currentElementRef.current &&
            ev.target.parentNode.parentNode != this.currentElementRef.current &&
            ev.target.parentNode.parentNode.parentNode != this.currentElementRef.current

        ) {
            TaskContextMenu.disableContextMenu();
        }
    }

    disableContextMenu() {
        this.setState({
            isActive: false,
            posX: -1,
            posY: -1
        });

        document.removeEventListener('click', this.onMouseClick);
    }

    render() {
        return (
            <>
                <nav
                    ref={this.currentElementRef}
                    style={{ left: this.state.posX, top: this.state.posY }}
                    className={this.state.isActive ? `${styles.contextMenu} ${styles.active}` : styles.contextMenu}>
                    <ul className={styles.btnContainer}>
                        <span>{this.state.task != null ? this.state.task.title : ""}</span>
                        {this.state.task != null ? this.state.task.taskStatus == 0 ?
                            <button onClick={(ev) => {
                                this.state.btnEvents.onUncompleteClick();
                            }}><i className="fa-solid fa-xmark"></i> Отменить выполнение
                            </button>
                            :
                            <button onClick={(ev) => {
                                this.state.btnEvents.onCompleteClick();
                            }}><i className="fa-solid fa-check"></i> Выполнить
                            </button>
                            :
                            null
                        }


                        <button onClick={(ev) => {
                            this.state.btnEvents.onUpdateClick();
                        }}>
                            <i className="fa fa-edit"></i> Изменить
                        </button>
                        <button onClick={(ev) => {
                            this.state.btnEvents.onRemoveClick();
                        }}>
                            <i className="fa-solid fa-trash"></i> Удалить
                        </button>
                    </ul>
                </nav>
            </>
        );
    }
}
