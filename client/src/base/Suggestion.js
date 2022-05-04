import List from "./List";
import { ListEntry } from "./index";
import { Card, Container, Row } from "react-bootstrap";
import "./Suggestion.css";

function Suggestion(props) {
  return (
    <Container className="suggestion-container" fluid>
      <Card className="suggestion-card">
        <Card.Body>
          <List scope={props.scope} title={props.title} rows={props.rows} />
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Suggestion;
