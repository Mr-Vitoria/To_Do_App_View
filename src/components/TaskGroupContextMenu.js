import React, { Component } from 'react';
import styles from '../public/css/contextMenu.module.css';
import { TaskContextMenu } from './TaskContextMenu';


export class TaskGroupContextMenu extends Component {
    static displayName = TaskGroupContextMenu.name;

    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
            posX: -1,
            posY: -1,
            group: null,
            btnEvents: {
                onUpdateClick: null,
                onRemoveClick: null
            }
        };
        TaskGroupContextMenu.activeContextMenu = this.activeContextMenu.bind(this);
        TaskGroupContextMenu.disableContextMenu = this.disableContextMenu.bind(this);


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

    activeContextMenu(group, btnEvents, isActive, mouseEvent) {
        let position = this.getPosition(mouseEvent);
        TaskContextMenu.disableContextMenu();

        this.setState({
            group: group,
            btnEvents: btnEvents,
            isActive: isActive,
            posX: position.x,
            posY: position.y
        });

        document.addEventListener('click', this.onMouseClick);
    }
    onMouseClick(ev) {
        try {

            if (!ev.target.classList.contains("btnOpenSetting") &&
                !ev.target.parentNode.classList.contains("btnOpenSetting") &&
                ev.target != this.currentElementRef.current &&
                ev.target.parentNode != this.currentElementRef.current &&
                ev.target.parentNode.parentNode != this.currentElementRef.current &&
                ev.target.parentNode.parentNode.parentNode != this.currentElementRef.current

            ) {
                TaskGroupContextMenu.disableContextMenu();
            }
        }
        catch (ex) {
            console.log(ex);
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
                        <span>{this.state.group != null ? this.state.group.title : ""}</span>
                        <button onClick={(ev) => {
                            this.state.btnEvents.onUpdateClick();
                        }}>
                            <i className="fa fa-edit"></i> Изменить
                        </button>
                        <button onClick={(ev) => {
                            this.state.btnEvents.onRemoveClick();
                        }}>
                            <i className="fa fa-times"></i> Удалить
                        </button>
                    </ul>
                </nav>
            </>
        );
    }
}
