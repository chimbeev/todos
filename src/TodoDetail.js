import {Navigate, useParams} from "react-router-dom";


export default function TodoDetail(props) {
    const {key} = useParams(); /*получаем идентифкатор дела*/
    const deed = props.getDeed(key); /*получив идентификатор, извлекаем дело вызывая метод getDeed полученный с пропом*/
    if (!props.currentUser)
    return <Navigate to="/login" replace />;
    else return (
        <section>
            {deed.done && /*Если дело выполнено, компонент выведет абзац с текстом Выполнено*/
                <p className="has-text-success">Выполнено</p>
            }
            <h1>{deed.title}</h1>
            <p>{deed.createdAt}</p>
            {deed.desc && <p>{deed.desc}</p>}
            {deed.image && <p><img src={deed.image} alt="Иллюстрация" /></p>}

        </section>
    )
}