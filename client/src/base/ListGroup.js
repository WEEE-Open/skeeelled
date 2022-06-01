import { Container, Row, Col } from "react-bootstrap";
import { List } from "./";
import "./ListGroup.css";
import { Link } from "react-router-dom";

function ListGroup(props) {
  return (
    <Container>
      {props.lists
        .filter((useless, i) => i % props.cols === 0)
        .map((useless, i) => (
          <Row key={i}>
            {props.lists
              .slice(i * props.cols, (i + 1) * props.cols)
              .map((l, j) => (
                <Col key={j}>
                  <Link
                    className="list-attributes"
                    to={{
                      pathname:
                        "/listfullpage/" +
                        l.title.replace(/\s/g, "").toLowerCase(),
                    }}
                    state={{ scope: l.scope, title: l.title, rows: l.rows }}
                  >
                    <List
                      key={i + l.scope + l.title + "listComp"}
                      scope={l.scope}
                      title={l.title}
                      rows={l.rows}
                      rounded={props.rounded}
                    />
                  </Link>
                </Col>
              ))}
            {props.tiled &&
              (i + 1) * props.cols > props.lists.length - 1 &&
              props.lists.length % props.cols > 0 &&
              [
                ...Array(props.cols - (props.lists.length % props.cols)).keys(),
              ].map((key) => <Col></Col>)}
          </Row>
        ))}
    </Container>
  );
}

export default ListGroup;
