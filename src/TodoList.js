import { Link, Navigate } from 'react-router-dom'; /*Добавляем компонент создающий гиперссылки*/
// ...... выводим таблицу с перечнем дел и задем стили через классы*/}
//is-hover able - подстветка строкпри наведении мыши на строку. is-fullwidth - растянуть таблицу на всю ширину родителя**/}
//Заголовок дела следует вывести зачеркнутым если дело выполнено*/}
//и не зачеркнутым если не выполнено.*/}


export default function TodoList(props) { // ...................... принимаем данные через props
    if (!props.currentUser)
        return <Navigate to="/login" replace />;
    else
    return (
        <section>  {/*...............................................корневой тэг */}
            <h1>Дела</h1>
            <table className="table is-hover able is-fullwidth">
                <tbody>
                 {props.list.map((item) => (
                    // .............................перебираем полученный массив с делами
                    <tr key={item.key}>
                        {/*............................выводит строку таблицы*/}
                        <td>
                            <Link to={`/${item.key}`}>
                                {item.done && <del>{item.title}</del>}
                                {!item.done && item.title}
                            </Link>
                        </td>
                        <td>
                            <button
                                className="button is-success"
                                // button - класс основное оформление кнопки Bulma, is-success- зеленый цвет
                                title="Пометить как сделанное"
                                disabled={item.done}
                                onClick={(e) => props.setDone(item.key)}
                                //Указываем в качестве обработчика щелчка на кнопке Пометить как сделанное  функцию, полученную с пропом setDone
                            >
                                &#9745;
                                {/*.................................На кнопке помеч дело как выполн будет символ галочки*/}
                            </button>
                        </td>
                        <td>
                            <button
                                className="button is-danger"
                                //is-danger - красный цвет
                                title="Удалить"
                                onClick={(e) => props.delete(item.key)}
                            >
                                &#9746;
                                {/*//...........................На кнопке удал дела будет символ крестика*/}
                            </button>
                        </td>
                    </tr>
                ))}
                {/*//конец цикла перебора массива*/}
                </tbody>
            </table>
        </section>
    );
}

