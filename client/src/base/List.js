import {Table} from "react-bootstrap";
import {ListEntry} from "./"
import "./List.css";

function HeaderColspan(scope) {
    switch(scope) {
        case "courses":
            return "4";
        case "questions":
            return "4";
        default:
            return "10";
    }
}

function ListQuestions({props}) {
    return(<>
        <h3 className="listTitle">{props.title}</h3>
        {props.rows.map(r => (
            <ListEntry scope={props.scope} row={r}/>
        ))}
    </>);
}

function List(props) {
    return(<>
        {props.scope==="questions" ? <ListQuestions props={props}/> : <Table bordered borderless className="table">
            <thead className="title">
                <tr>
                    <th colspan={HeaderColspan(props.scope)}>{props.title}</th>
                </tr>
            </thead>
            <tbody>
                {props.rows.map(r => (
                    <ListEntry scope={props.scope} row={r}/>
                ))}
            </tbody>
        </Table>}
    </>);
}

export default List;