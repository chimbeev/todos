import { HashRouter, Routes, Route, NavLink } from "react-router-dom";
import {Component} from 'react';
import TodoList from './TodoList'; //импортируем компонент из модуля src\TodoList.js
import TodoAdd from './TodoAdd'; //импортируем компонент из модуля src\TodoAdd.js
import TodoDetail from './TodoDetail';
import { getAuth, onAuthStateChanged } from "firebase/auth"; //Чтобы отслеживать статус пользователя (выполнил вход или нет)
import Register from "./Register";
import firebaseApp from "./firebase";
import Logout from "./Logout";
import Login from "./Login";
import {getList} from "./auth"; //чтобы получать список дел пользователя
import {setDone} from "./auth"; //чтобы пометить дело ак выполненное
import {del} from "./auth";
import {act} from "@testing-library/react"; //чтобы удалить дело

//const date1 = new Date(2021, 7, 19, 14, 5);
//const date2 = new Date(2021, 7, 19, 15, 23);


//const initialData = [  ..............Обьявили массив с двумя заплан делами... 1
 //   {
 //       title: 'Изучить React',
 //       desc: 'Да поскорее!',
 //       image: '',
 //       done: true,  ..................пометили как выполненное.............................. 2
 //       createdAt: date1.toLocaleString(),
 //       key: date1.getTime()
 //   },

//        title: 'Написать первое React-приложение',
//        desc: 'Список запланированных дел',
//        image: '',
//        done: false,
 //       createdAt: date2.toLocaleString(),
 //       key: date2.getTime()
 //   }
//];



export default class App extends Component { // ...класс компонента react должен быть производным от класса Component. 3
    constructor(props) { // ......................................... 4
        /*В конструкторе обязательно следует вызвать конструктор базового
        класса, передав ему полученный через параметр объект с пропами (поз. 5), иначе
        компонент не заработает.*/
        super(props); // .............................................. 5
        /*массив с делами, хранящийся в константе initialData, присваивается свойству data (поз. 6).*/
        this.state = {
            //data: initialData,
            data: [], //сделаем так, чтобы изначально в свойство data обьекта состояния заносился пустой массив
            showMenu: false,
            currentUser: undefined}; //Добавили в обьект состояние св-во currentUser. Оно будет хранить обьект
        //текущего пользователя если он выполнил вход, и null если нет.
        /* чтобы реализовать вывод и скрытие меню навигации, добавим в состав обьекта состояния showMenu*/
        //в нашем обьекте состояния будет находится свойство data, хранящее ссылку на массив дел
        this.setDone = this.setDone.bind(this); //Метод bind создает на основе переданной фнкции новую функцию ,
    //    в которой переменная this ссылается на обьект , указанный в первом параметре метода bind
        this.delete = this.delete.bind(this);
        this.add = this.add.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.authStateChanged = this.authStateChanged.bind(this);
        this.getDeed = this.getDeed.bind(this);
    }

    async setDone(key) {
        //Этот метод помечает дело как выполненное
        await setDone(this.state.currentUser, key);
        const deed = this.state.data.find((current) => current.key === key);
        //Используем метод find() класса Array для поиска в массиве дела, у которого идент совпадает с полученным в качестве параметра
        //Если дело найдено, заносим в его свойство done значение true
        if (deed)
            deed.done = true;
        this.setState((state) =>({}));
    //    Меняем состояние, не меняя значений свойств, для чего вернем из функции переданной методу setState() пустой объект
    }
    async delete(key) {
    //    Этот метод удалит дело с заданным идентификатором
        await del(this.state.currentUser, key);
        const newData = this.state.data.filter(
            (current) => current.key !==key
            //получаем новый массив дел, не содержащий дела с указанным идентификатором
        );
        this.setState((state) => ({data: newData}));
    //    после чего меняем состояние, занеся в свойство data обновленного обьекта состояния ссылку на новый массив
    }
    //Этот метод добавит в массив новое дело, представленное простоым обьектом
    add(deed) {
        //Мы добавляем новое дело в массив из свойства data объекта состояния и изменяем состояние, не меняя значений его свойств
        this.state.data.push(deed);
        this.setState((state) => ({}));
    }
    /* обработчик события click кнопки-гамбургера. Здесь станем изменять состояние компонента, инвертируя showMenu */
    /* в результате если меню навигации было скрыто, то оно появится и наоборот*/
    showMenu(evt) {
        evt.preventDefault();
        this.setState((state) => ({ showMenu: !state.showMenu }));
    }
    /*этот метод найдет в массиве и вернет дело с указанным идентификатором */
    getDeed(key) {
        /*преобразовываем с помощью унарного плюса строку в число */
        //key = +key; Исправили ошибку чтобы идентификатор дела не преобразовывался в числовой тип, так как
        //идентификаторы, под которыми документы сохраняются в базе Firebase являются строками
        return this.state.data.find((current) => current.key === key);
    }

    async authStateChanged(user) { //Этот метод будет вызываться при изменении статуса пользователя и заносить полученное значение
        //в состояние компонента. Если пользователь выполнил вход, метод получит в качестве параметра обьект пользователя,
        //а если пользователь вышел , то значение null
        await act(() => {
            this.setState((state) => ({currentUser: user}));
        });
        //Сделаем так чтобы если пользователь не выполнил вход - выводился пустой список дел
        //Если пользователь выполнил вход - выводился перечень созданных им дел.
        if (user) {
            const newData = await getList(user);
            await act(() => {this.setState((state) => ({data: newData}));});
        } else {this.setState((state) =>({ data: []}));
        }
    }

    componentDidMount() {//Метод authStateChanged надо зарегистрировать в библиотеке firebase в качестве обработчика смены
        //статуса пользователя. Для этого вызываем функцию getAuth() из модуля firebase/auth, передав ей обьект серверного
        //приложения, импортированный из модуля firebase.js. Потом передаем выданный этой функцией обьект, вместе с методом
        //authStateChanged() функции onAuthStateChange() из модуля firebase/auth
        //Метод this.componentDidMount() автоматически вызвывается после первоначального отображения компонента на странице
        //(монтирования) - подобные методы вызвываемые самим ядром React в определенные моменты существования компонента
        // носят название волшебных

        onAuthStateChanged(getAuth(firebaseApp), this.authStateChanged);
    }

    /*метод render() (поз. 7), который выводит компонент на страницу. Он должен возвращать особый объект,
    представляющий содержимое компонента: все имеющиеся в нем абзацы, заголовки, списки, таблицы, элементы управления и пр. (поз. 8).*/
    render() { // ................................................... 7
        return ( // ..........Далее идет JSX код......................................... 8

            <HashRouter> {/* ....это маршрутизатор............... 14*/}

                <nav className="navbar is-light"> {/* ......................
                    со стилевым классом navbar-brand — обозначение бренда, выводящееся в левой части полосы навигации и обычно представляю-
                    щее собой название приложения.*/}
                    <div className="navbar-brand"> {/* ....................... 12
                        со стилевыми классами navbar-item (собственно обозначение бренда) и is-uppercase (приведение
                        текста к верхнему регистру), в котором и выводится наш бренд — слово «Todos». */}
                        <NavLink to="/" className={({ isActive }) =>
                            'navbar-item is-uppercase' + ( isActive ? ' is-active' : '')}
                        >
                            {/*В обозначении бренда выводим - в зависимости от статуса пользователя - его адрес
                            электронной почты или надпись Todos, а левой части меню пункт Создать дело или Зарегистрироваться */}
                            { this.state.currentUser ? this.state.currentUser.email : 'Todos' }
                        </NavLink>
                        {/* Кнопку гамбургер создается с классом nav-burger */}
                            <a href="/" className={this.state.showMenu ? 'navbar-burger is-active' : 'navbar-burger'}
                               onClick={this.showMenu}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </a>
                    </div>

                    <div className={this.state.showMenu ? 'navbar-menu is-active' : 'navbar-menu'} onClick={this.showMenu}>
                            {/* также привязываем к меню навигации обработчик click. чтобы меню навигации скрывалось после выбора в нем */}
                        <div className="navbar-start">
                            {this.state.currentUser && (
                                <NavLink to="/add" className={({ isActive }) => 'navbar-item' + (isActive ? ' is-active' : '')}>
                                    Создать дело
                                </NavLink>
                            )}
                            {!this.state.currentUser && (
                                <NavLink to="/login" className={({ isActive }) => 'navbar-item' + (isActive ? ' is-active' : '')}>
                                    Войти
                                </NavLink>
                            )}
                            {!this.state.currentUser && (
                                <NavLink to="/register" className={({ isActive }) => 'navbar-item' + (isActive ? ' is-active' : '')}>
                                    Зарегистрироваться
                                </NavLink>
                            )}
                        </div>
                        {this.state.currentUser && (
                            <div className="navbar-end">
                                <NavLink to="/logout" className={({ isActive }) => 'navbar-item' + (isActive ? ' is-active' : '')}>
                                    Выйти
                                </NavLink>
                            </div>
                        )}
                    </div>
                </nav>
                {/* со стилевыми классами content (обычное оформление содержимого страницы в стиле Bulma), px-6 (большие внутренние отступы сле-
                ва и справа) и mt-6 (большой внешний отступ сверху) — контейнер для вывода содержимого экранов. Изначально в нем присутствует заголовок «Todos»,
                позже мы заменим его на компонент перечня дел. */}

                <main className="content px-6 mt-6"> {/* ................... 14*/}
                    <Routes> {/* ....коммутатор - отдельные экраны приложения будут выводиться в теге main
                    В коммутатор поместили список маршрутов............... 14*/}
                        {/* ....создаем маршрут............... 14*/}
                        <Route path="/" element={
                            <TodoList list={this.state.data}
                                      setDone={this.setDone}
                                      delete={this.delete}
                                      currentUser={this.state.currentUser} />
                        } />
                        <Route path="/add" element={
                            <TodoAdd add={this.add} currentUser={this.state.currentUser}/> //чтобы компонент TodoAdd смог
                            //занести новое дело в базу данных, он должен занить текущего пользователя. Его будем передавать
                            //этому компоненту через проп currentUser
                        } />
                        {/* Добавляем маршрут , ведущий на компонент регистрации*/}
                        <Route path="/register" element={
                            <Register currentUser={this.state.currentUser} />
                        } />
                        {/*создадим маршрут указывающий на компонент TodoDetail и обозначаем URL параметр в шаблонном пути*/}
                        <Route path="/:key" element={
                            <TodoDetail getDeed={this.getDeed} currentUser={this.state.currentUser} />
                        } />
                        <Route path="/logout" element={
                            <Logout currentUser={this.state.currentUser} />
                        } />
                        <Route path="/login" element={
                            <Login currentUser={this.state.currentUser} />
                        } />
                    </Routes>

                </main>
            </HashRouter>

        ); // ......................................................... 9
    }
}