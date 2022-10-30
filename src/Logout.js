import { Navigate } from "react-router-dom";
import { logout } from './auth';

export default function Logout(props) {
    if (props.currentUser) { //если пользователь выполнил вход, функция произведеи выход и вернет null, сообщая , что
        //больше ничего не собирается делать на странице. Компонент App отследит выход пользователя и обновит компонент
        //Logout, который произведет перенаправление по пути /login  - на экран входа
        logout();
        return null;
    } else return <Navigate to="/login" replace />;
}
