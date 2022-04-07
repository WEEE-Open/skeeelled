import {Row, Col, Container} from "react-bootstrap";
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
    return(<div className="questionEntry">
        <Row><Col><Link to={"/question/"+props.row.id} className="question">{props.row.question}</Link></Col></Row>
        <Row>
            <Col>from {props.row.author}</Col>
            <Col>Created at: {props.row.createdat}</Col>
        </Row>
        <Row><Col>{props.row.tags.map(t => <Link to="" className="tags">#{t}</Link>)}</Col></Row>
        <Row><Col>{props.row.excerpt}</Col></Row>
    </div>);
}

function ListEntryAnswers(props) {
    return(<tr>
        <td>todo</td>
    </tr>);
}

function ListEntryTest(props) {
    return(<tr>
        <td>{props.row.a}</td>
        <td>{props.row.b}</td>
        <td>{props.row.c}</td>
    </tr>);
}

function ListEntrySuggestion(props) {
    return(
        <Container>
            <Row><Col><Link to={"/suggestion/"+props.row.id} className="suggestion">{props.row.suggestion}</Link></Col></Row>
            <Row>
                <Col>from {props.row.author}</Col>
                <Col>Created at: {props.row.createdat}</Col>
            </Row>
        </Container>
    )
}

function ListEntry(props) {
    return(<>
        {props.scope==="default" && <ListEntryDefault row={props.row}/>}
        {props.scope==="courses" && <ListEntryCourses row={props.row}/>}
        {props.scope==="questions" && <ListEntryQuestions row={props.row}/>}
        {props.scope==="answers" && <ListEntryAnswers row={props.row}/>}
        {props.scope==="test" && <ListEntryTest row={props.row}/>}
        {props.scope==="test" && <ListEntryTest row={props.row}/>}
    </>);
}

export default ListEntry;