import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./ListEntry.css";

function ListEntryDefault(props) {
    return(<tr>
        {props.row.map(cell => (<td>{cell}</td>))}
    </tr>);
}

function ListEntryCourses(props) {
    return(<tr>
        <td>{props.row.code}</td>
        <td><Link to={"/course/"+props.row.code}>{props.row.course}</Link></td>
        <td>{props.row.professor}</td>
        <td>{props.row.cfu}</td>
    </tr>);
}

function ListEntryQuestions(props) {
    return(<tr>
        <td><Link to={"/question/"+props.row.id}><Button className="btn-sm">View</Button></Link></td>
        <td>{props.row.question}</td>
        <td>{props.row.author}</td>
        <td>{props.row.createdat}</td>
    </tr>);
}

function ListEntryAnswers(props) {
    return(<tr>
    </tr>);
}

function ListEntryTest(props) {
    return(<tr>
        <td>{props.row.a}</td>
        <td>{props.row.b}</td>
        <td>{props.row.c}</td>
    </tr>);
}

function ListEntry(props) {
    return(<>
        {props.scope==="default" && <ListEntryDefault row={props.row}/>}
        {props.scope==="courses" && <ListEntryCourses row={props.row}/>}
        {props.scope==="questions" && <ListEntryQuestions row={props.row}/>}
        {props.scope==="answers" && <ListEntryAnswers row={props.row}/>}
        {props.scope==="test" && <ListEntryTest row={props.row}/>}
    </>);
}

export default ListEntry;