//Для регистрации пользователя создадим класс Register, который будет регистрировать в службе fireBase нового пользователя
//с заданными адресом электронной почты и паролем. В качестве результата она вернет либо обьект со сведениями о новом
//пользователе , либо код ошибки
//Даем доступ к register только если вход в приложение не был выполнен (кто уже зашел - не недо заново регится
//Чтобы выполнивший вход пользователь не мог снова зарегится , передадим компонту регистрации с пропом currentUser обьект
//текущего пользователя, если пользователь выполнил вход, и пустое значение - если не зашел. Компонент проверит этот проп,
//и если там есть обьект пользователя , сразу же перенаправить на экран перечня дел

import { Component } from "react";
import {Navigate} from "react-router-dom";
import {register} from "./auth";

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorEmail: '', //для хранения сообщений об ошибках ввода почтового адреса
            errorPassword: '', //для хранения сообщений об ошибках ввода пароля
            errorPasswordConfirm: '' //для хранения сообщений об ошибках ввода повторного пароля
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.clearFormData();

    }
    clearFormData() {
        this.formData = {
            email: '',
            password: '',
            passwordConfirm: ''
        };
    }

    handleEmailChange(evt) {
        this.formData.email = evt.target.value; //считываем введенный адрес почты
    }

    handlePasswordChange(evt) {
        this.formData.password = evt.target.value; //считываем введенный пароль
    }

    handlePasswordConfirmChange(evt) {
        this.formData.passwordConfirm = evt.target.value; //считываем повторно введенный пароль
    }


    async handleFormSubmit(evt) {
        evt.preventDefault();
        if (this.validate()) { //Проверка на валидность введенных данных
            //При нажатии кнопки регистрации регистрируем нового пользователя, вызвав фукцию register из модуля auth
            //
            const result = await register(this.formData.email, this.formData.password);
            //Если функция register вернет что либо отличное от обьекта, то выводим эту ошибку в приложение
            if (typeof result !== 'object') this.showErrorMessage(result);
        }
    }

    resetErrorMessages() { //Чтобы удалить со страницы все выведенные ранее сообщения об ошибках
        this.setState((state) => ({
            errorEmail: '',
            errorPassword: '',
            errorPasswordConfirm: ''
        }));
    }

    validate()  { //Для выполнения валидации. Функция вернет true, если занесенные данные корректны, и false -  в противном случае
        this.resetErrorMessages(); //сначала сбрасываем сообщения об ошибках
        if (!this.formData.email) { //проверяем введенное значение на корректность
            this.setState((state) => ({ //если значение не корректно , заносим сообщение об ощибке св-во состояния
                errorEmail: 'Адрес электронной почты не указан'
            }));
            return false; //и возвращаем false
        }
        if (!this.formData.password) { //Если первое значение корректно, то проверяем второе значение
            this.setState((state) => ({
                errorPassword: 'Пароль не указан'
            }));
            return false;
        }
        if (!this.formData.passwordConfirm) {
            this.setState((state) => ({
                errorPasswordConfirm: 'Повтор пароля не указан'
            }));
            return false;
        }
        if (this.formData.password !== this.formData.passwordConfirm) {
            this.setState((state) => ({
                errorPassword: 'Введенные пароли не совпадают',
                errorPasswordConfirm: 'Введенные пароли не совпадают'
            }));
            return false;
        }
        return true; // в случае корректности всех значений возвращаем true
    }

    showErrorMessage(code) { //Для вывода сообщения об ошибке , код которой был возвращен firebase
        this.resetErrorMessages();
        if (code ==='auth/email-already-in-use') {
            this.setState((state) =>({
                errorEmail: 'Пользователь с таким адресом электронной ' + ' почты уже зарегистрирован'
            }));
        } else if (code === 'auth/weak-password') {
            this.setState((state) => ({
                errorPassword: 'Слишком простой пароль',
                errorPasswordConfirm: 'Слишком простой пароль'
            }));
        }
    }

    render() {
        //При выводе компонента проверяем проп currentUser. Если там есть обьект пользователь , то направляем на перечень дел
        if (this.props.currentUser) return <Navigate to="/" replace />; //replace предписывает заменить в списке истории
        // вебобозревателя текущий адрес указанным в пропе to.В результатет пользователь не сможет вернуться на экран
            //регистрации
        else return ( //Если нет пользользователя то на экран регистрации пользователя
            <section>
                <h1>Регистрация</h1>
                <form onSubmit={this.handleFormSubmit}>
                    <div className="field">
                        <label className="label">Адрес электронной почты</label>
                        <div className="control">
                            <input type="email" className="input" onChange={this.handleEmailChange}/>
                        </div>
                        {this.state.errorEmail &&  //Для вывода сообщений об ошибках поместим под блок со стилем control
                            //абзац со стилевым классом help и is-danger. Он будет выводится только если будет ошибка
                            <p className="help is-danger">
                                {this.state.errorEmail}
                            </p>
                        }
                    </div>
                    <div className="field">
                        <label className="label">Пароль</label>
                        <div className="control">
                            <input type="password" className="input" onChange={this.handlePasswordChange} />
                        </div>
                        {this.state.errorPassword && //Для вывода сообщений об ошибках поместим под блок со стилем control
                            //абзац со стилевым классом help и is-danger. Он будет выводится только если будет ошибка
                        <p className="help is-danger">
                            {this.state.errorPassword}
                        </p> }
                    </div>
                    <div className="field">
                        <label className="label">Повтор пароля</label>
                        <div className="control">
                            <input type="password" className="input"
                                    onChange={this.handlePasswordConfirmChange}/>
                        </div>
                        {this.state.errorPasswordConfirm &&
                        <p className="help is-danger">
                            {this.state.errorPasswordConfirm}
                        </p> }
                    </div>
                    <div className="field is-grouped is-grouped-right">
                         <div className="control">
                             <input type="reset"
                                    className="button is-link is-light" value="Сброс" />
                         </div>
                        <div className="control">
                            <input type="submit" className="button is-primary" value="Зарегистрироваться"/>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
}
