import React, { Component } from 'react';
import styles from '../../public/css/setting.module.css';

export default class ImageChangeModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userImg: props.userImg
        };


        this.inputImageRef = React.createRef();

        this.closeModal = props.closeModal;

        this.updateImage = props.updateImage;
    }

    //Render function
    render() {
        return (
            <div className={`modal active`} >
                <div className="fadeBack"></div>
                <div className={`modal-content ${styles.modalImageChange}`}>
                    <div className={`header ${styles.header}`}>
                        <button onClick={(ev) => {
                            this.closeModal();
                        }}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div className={styles.imageChangeBody}>
                        <div className={styles.optionContainer}>

                            <label>URL изображения</label>
                            <input
                                type='url'
                                defaultValue={this.state.userImg}
                                placeholder="URL изображения"
                                onInput={(ev) => {
                                    this.setState({
                                        userImg: ev.target.value
                                    });
                                }}
                            />
                        </div>
                        <img src={this.state.userImg} />

                        <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                            <button onClick={(ev) => {
                                this.updateImage(this.state.userImg);
                            }} className={`btnDark ${styles.btnDark}`}>Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}