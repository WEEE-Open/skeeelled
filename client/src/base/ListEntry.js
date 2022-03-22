import {Table} from "react-bootstrap";
import "./ListEntry.css";

function ListEntry(props) {
    return(
        <Table bordered borderless className="table">
            <thead className="title">
                <tr><th>{props.title}</th></tr>
            </thead>
            <tbody>
                {props.rows.map(r => (
                    <tr><td>{r}</td></tr>
                ))}
            </tbody>
        </Table>
    );
}

export default ListEntry;