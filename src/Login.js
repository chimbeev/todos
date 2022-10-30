import { Component } from "react";
import {Navigate} from "react-router-dom";
import {login} from "./auth";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorEmail: '', //для хранения сообщений об ошибках ввода почтового адреса
            errorPassword: '' //для хранения сообщений об ошибках ввода пароля
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.clearFormDataLogin();
    }
    clearFormDataLogin() {
        this.formDataLogin = {
            email: '',
            password: ''
        };
    }

    handleEmailChange(evt) {
        this.formDataLogin.email = evt.target.value; //считываем введенный адрес почты
    }

    handlePasswordChange(evt) {
        this.formDataLogin.password = evt.target.value; //считываем введенный пароль
    }


    async handleFormSubmit(evt) {
        evt.preventDefault();
        if (this.validateLogin()) {
            //При нажатии кнопки войти производим вход пользователя, вызвав фукцию login из модуля auth
            //
            const result = await login(this.formDataLogin.email, this.formDataLogin.password);
            //Если функция login вернет что либо отличное от обьекта, то обрабатываем эту ошибку и выводим сообщение
            if (typeof result !== 'object') this.showErrorMessageLogin(result);
        }
    }

    resetErrorMessagesLogin() { //Чтобы удалить со страницы все выведенные ранее сообщения об ошибках
        this.setState((state) => ({
            errorEmail: '',
            errorPassword: ''
        }));
    }

    validateLogin()  { //Для выполнения валидации. Функция вернет true, если занесенные данные корректны, и false -  в противном случае
        this.resetErrorMessagesLogin(); //сначала сбрасываем сообщения об ошибках
        if (!this.formDataLogin.email) { //проверяем введенное значение на корректность
            this.setState((state) => ({ //если значение не корректно , заносим сообщение об ощибке св-во состояния
                errorEmail: 'Адрес электронной почты не указан'
            }));
            return false; //и возвращаем false
        }
        if (!this.formDataLogin.password) { //Если первое значение корректно, то проверяем второе значение
            this.setState((state) => ({
                errorPassword: 'Пароль не указан'
            }));
            return false;
        }

        return true; // в случае корректности всех значений возвращаем true
    }

    showErrorMessageLogin(code) { //Для вывода сообщения об ошибке , код которой был возвращен firebase
        this.resetErrorMessagesLogin();
        if (code ==='auth/user-not-found') {
            this.setState((state) =>({
                errorEmail: 'Пользователь с таким адресом электронной ' + ' почты не найден'
            }));
        } else if (code === 'auth/wrong-password') {
            this.setState((state) => ({
                errorPassword: 'Неправильный пароль',
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
                <h1>Вход в приложение</h1>
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
                            </p>
                        }
                    </div>
                    <div className="field is-grouped is-grouped-right">
                        <div className="control">
                            <input type="reset"
                                   className="button is-link is-light" value="Сброс" />
                        </div>
                        <div className="control">
                            <input type="submit" className="button is-primary" value="Войти в приложение"/>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
}
