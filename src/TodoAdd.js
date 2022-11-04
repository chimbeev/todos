//Компонет который выполняет добавление дел
import { Component } from 'react';
import { Navigate } from "react-router-dom";
import { add } from './auth';

export default class TodoAdd extends Component {
    constructor(props) {
        super(props);
        /*создадим у компонента состояние со свойством redirect, которое будет хранить false при вводе нового дела
        *и true если дело создано и нужно сделать перенаправление */
        this.state = { redirect: false };
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.clearFormData();
    }
//ДЛя хранения значений из элементов управления используем простой объект  formData со свойствами title, desc и image.
    //Этот метод создаст новый пустой объект для данных из Web формы.
    clearFormData() {
        this.formData = {
            title: '',
            desc: '',
            image: ''
        };
    }
//Эти три метода переносят значения, занесенные в поле заголовка, область описания и поле выбора графической иллюстрации
    //в соответ. свойства объекта formData компонента. Далее их используем как обработчики событий change соот. элементов управления.
    handleTitleChange(evt) {
        this.formData.title = evt.target.value;
    }

    handleDescChange(evt) {
        this.formData.desc = evt.target.value;
    }

    handleImageChange(evt) {
        const cFiles = evt.target.files;
        if (cFiles.length > 0) {
            const fileReader = new FileReader();
            const that = this;
            fileReader.onload = () => {
                that.formData.image = fileReader.result;
            }
            fileReader.readAsDataURL(cFiles[0]);
        } else
            this.formData.image = '';
    }
//Это обработчик события Submit вебформы
    async handleFormSubmit(evt) {
        //сначала отлючаем обработку события по умолчанию
        evt.preventDefault();
        //создаем копию объекта из свойства formData
        const newDeed = {...this.formData};
        const date = new Date();
        //метка что дело не выполнено
        newDeed.done = false;
        //заносим строку с текущими датой и временем
        newDeed.createdAt = date.toLocaleString();
        //newDeed.key = date.getTime();
        //вызываем полученный с пропом add метод от родителя. Он создает новое дело
        //this.props.add(newDeed);
        const addedDeed = await add(this.props.currentUser, newDeed); //Для добавления дела в базу данных вызываем метод
        //add, обьявленный в модуле auth.
        this.props.add(addedDeed);//добавляем дело в список, хранящийся в компоненте приложения, вызвав метод add() этого компонента
        /*после создания дела меняем состояние, одновеременно занеся в его свойство redirect значение true
        * Изменение состояния вызовет его обновление*/
        this.setState((state) => ({ redirect: true }));//
    }

    render() {
        if (!this.props.currentUser)
            return <Navigate to="/login" replace />;
        else if (this.state.redirect)
            return <Navigate to="/" />;
        else
        return (
            <section>
                <h1>Создание нового дела</h1>
                <form onSubmit={this.handleFormSubmit}>
                    <div className="field">
                        <label className="label">Заголовок</label>
                        <div className="control">
                            <input className="input" onChange={this.handleTitleChange}/>
                        </div>
                    </div>
                    <div className="field">
                        <label className="label">Примечание</label>
                        <div className="control">
                            <textarea className="textarea" onChange={this.handleDescChange}/>
                        </div>
                    </div>
                    <div className="field">
                        <div className="file">
                            <label className="file-label">
                                <input className="file-input" type="file" accept="image/*"
                                       onChange={this.handleImageChange}/>
                                <span className="file-cta">
                                    <span className="file-label">
                                        Графическая иллюстрация...
                                    </span>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="field is-grouped is-grouped-right">
                        <div className="control">
                            <input type="reset" className="button is-link is-light" value="Сброс"/>
                        </div>
                        <div className="control">
                            <input type="submit" className="button is-primary" value="Создать дело"/>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
}
