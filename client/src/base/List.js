import { Col, Container, Row, Table, Form, FloatingLabel, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ListEntry, SearchBar } from "./";
import "./List.css";

function HeaderColspan(scope) {
  switch (scope) {
    case "courses":
      return "4";
    case "questions":
      return "4";
    default:
      return "10";
  }
}

function ListDefault({ props }) {
  return (
    <>
      {props.rounded ? (
        <table className="list roundedList">
          <thead>
            <tr>
              <th className="listTitle" colSpan={HeaderColspan(props.scope)}>
                {props.title}
              </th>
            </tr>
          </thead>
          <tbody>
            {props.rows.map((r) => (
              <ListEntry row={r} scope={props.scope} dotted={props.dotted} />
            ))}
          </tbody>
        </table>
      ) : (
        <Table striped borderless className="list">
          <thead className="listTitle">
            <tr>
              <th colSpan={HeaderColspan(props.scope)}>{props.title}</th>
            </tr>
          </thead>
          <tbody>
            {props.rows.map((r) => (
              <ListEntry scope={props.scope} row={r} />
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

function ListQuestions({ props }) {
  return (
    <>
      <h3 className="listQuestionsTitle">
        Physics I
        <Link to="/simulation"><Button className="right-button">Start simulation</Button></Link>
        <Button className="right-button" onClick={() => {}}>
          <Image className="add-icon" src={process.env.PUBLIC_URL + "/icons/ADD_WHITE.svg"} width="13px"/>
          {" Add course"}
        </Button>
      </h3>
      <Row>
        <Col className="listQuestionsTitle">
          <SearchBar />
        </Col>
      </Row>
      {props.rows.map((r) => (
        <ListEntry scope={props.scope} row={r} />
      ))}
    </>
  );
}

function ListAnswers({ props }) {
  return (
    <Table borderless className="list listAnswers">
      <tbody>
        {props.rows.map((r) => (
          <ListEntry scope={props.scope} row={r} />
        ))}
      </tbody>
    </Table>
  );
}

function ListReplies({ props }) {
  return (
    <>
      <h4>{props.title}</h4>
      <hr/>
      {props.rows.map((r) => (
        <ListEntry scope={props.scope} row={r} />
      ))}
    </>
  );
}

function ListSuggestion({ props }) {
  return (
    <>
      <Container>
        <h3 className="listSuggestionTitle">{props.title}</h3>
        <div className="listSuggestion-questions">
          {props.rows.map((r) => (
            <ListEntry scope={props.scope} row={r} />
          ))}
        </div>
      </Container>
    </>
  );
}

function ListSelection({ props }) {
  return (
    <FloatingLabel label={props.title}>
      <Form.Select aria-label="Selection" className="my-4">
        {props.rows.map((r,i) => (
          <ListEntry scope={props.scope} row={r} key={i} />
        ))}
      </Form.Select>
    </FloatingLabel>
  );
}

function List(props) {
  if (props.scope === "questions") return <ListQuestions props={props} />;
  if (props.scope === "answers") return <ListAnswers props={props} />;
  if (props.scope === "replies") return <ListReplies props={props} />;
  if (props.scope === "suggestion") return <ListSuggestion props={props} />;
  if (props.scope === "selection") return <ListSelection props={props} />;
  return <ListDefault props={props} />;
}

export default List;