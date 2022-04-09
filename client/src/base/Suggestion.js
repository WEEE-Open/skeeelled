import List from "./List";
import {Card, Container, Row} from "react-bootstrap";
import "./Suggestion.css"

function Suggestion (props) {
    return (
        <Container id='suggestion-container' fluid>
                <Card
                    style={{
                        width: '25vw',
                        borderRadius: 20,
                    }}
                >
                    <Card.Body>
                        <List id='latest-questions' scope={props.scope} title={props.title} rows={props.rows}/>
                    </Card.Body>
                </Card>
        </Container>
    )
}

export default Suggestion;