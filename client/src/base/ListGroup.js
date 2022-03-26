import {Container} from "react-bootstrap";
import {ListEntry} from "./"

function ListGroup(props) {
    return(
        <Container>
            {props.entries.map(e => {
                <ListEntry title={e.title} rows={e.rows}/>
            })}
        </Container>
    );
}

export default ListGroup;