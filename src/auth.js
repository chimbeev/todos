import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"; // getAuth - получаем обьект подсистемы разграничения доступа
//Функция createUserWithEmailAndPassword из того же модуля регистрирует в FireBase нового пользователя с адресом почты и паролем,
//заданными вторым и третьим параметрами
import  { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDatabase, ref, push, set, get, query } from "firebase/database";
//подключаем функции для работы с базой через Google FirebaseSDK
import { remove } from "firebase/database";

export async function login(email, password) { //Функция для входа от имени пльзователя с указанными адресом
    //электронной почты и паролем. Возвращает обьект пользователя если успешно вошел или код ошибки
    try { //Для входа достаточно вызвать функцию signInWithEmailAndPassword из модуля firebase/auth, передав ей
        //обьект подсистемы разгарничения доступа , адрес и пароль пользователя
        const oUC = await signInWithEmailAndPassword(getAuth(), email, password);
        return oUC.user;
    }
    catch (err) { return err.code }
}

export async function logout() { //выход обеспечивается вызовом функции signOut из модуля firebase/auth
    await signOut(getAuth());
}

export async function register(email, password) {
    try {
        //Функция получает обьект с результатом регистрации пользователя
        //Св-во user хранит обьект со сведениями о пользователе
        const oUC = await createUserWithEmailAndPassword(
            getAuth(), //получаем обьект подсистемы разграничения доступа
            email, password
        )
        return oUC.user;
    }
    catch (err) { return err.code; }//Если регистрация пользователя не успешна, перехватываем обьект-исключение и
    // возвращаем строковый код ошибки
}

export async function add(user, deed) {//эта функция добавит в базу данных FireBase указанное дело, созданное указанным
    //пользоватем
    const oRef = await push( //Эта функция создаст новый идентификатор, добавит его к пути заданной ссылки , сформировав новый путь,
        //по которому будет располагаться новый документ и вернет ссылку , указывающую на этот путь.
        ref( //полученную базу данных передаем первым параметром функции ref(), а вторым параметром указываем путь, по которому
            //будет храниться коллекция дел. Функция вернет обьект ссылки, указывающей на этот путь
            getDatabase(), //Сначала получаем обьект базы данных, вызвав функцию getDatabase()
            `users/${user.uid}/todos` //путь по которому будет храниться коллекция дел.Узнаем идентификатор пользователя
            // обратившись к свойству uid, обьекта пользователя
        )
    );
    await set(oRef, deed); //имея ссылку на пока пустой документ, запишемв него новое дело, вызвав функцию set()
    const oSnapshot = await get(query(oRef)); //вызовом функции query преобразуем ссылку на новый документ в запрос,
    //который передадим функции get(). Эта функция вернет снимок - обьект , хранящий добавленный документ и некоторые
    //свдения о нем.
    const oDeed = oSnapshot.val(); //извлечь сам документ, в виде обьекта, из снимка можно , вызвав метод val()
    oDeed.key = oRef.key; //Получаем идентификатор документа, обратившись к свойству key обьекта ссылки, и заносим
    //его в одноименное совйство документа.
    return oDeed;
}

export async function getList(user) { //выдает список дел пользователя
    const oSnapshot = await get(query(ref(getDatabase(), `users/${user.uid}/todos`))); //создаем ссылку на путь,
    //по которому хранятся дела текущего пользователя, преобразуем его в запрос и извлекаем снимок, хранящий коллекцию дел.
    const oArr = []; //создаем массив
    let oDeed;
    oSnapshot.forEach((oDoc) => { //перебираем элементы полученного снимка с помощью метода  forEach().
        oDeed = oDoc.val();
        oDeed.key = oDoc.key;
        oArr.push(oDeed);//Заносим каждое дело , не забыв добавить в него идентификатор, в заранее созданный массив
    });
    return oArr; //возвращаем новый массив дел
}

export function setDone(user, key) { //реализуем пометку дела как выполненного . Эта функция пометит дело как выполненное
    //с указанным идентификатором, созданныс пользователем
    return set(ref(getDatabase(), `users/${user.uid}/todos/${key}/done`), true); //Чтобы пометить дело с указанным
    //идентификатором как выполненное, создаем ссылку на путь users/идентификатор пользователя/todos/идентификатор дела/done,
    //где done - это имя совйства документа , хранящего признак завершения дела , и записываем в это свойство true
}

export function del(user, key) { //Удаляет дело с указанным идентификатором, созданное заданным пользователем
    return remove(ref(getDatabase(), `users/${user.uid}/todos/${key}`)); //удаление документа , находящегося по
    //заданной ссылке , выполняет функция remove() из модуля firebase/database.
}