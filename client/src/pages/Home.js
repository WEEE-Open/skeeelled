import { Row, Col, Card } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import "./stylesheet/Home.css";
import { ListGroup, SearchBar } from "../base/";
import API from "../api/API";
import isLabelEnd from "katex/dist/katex.mjs";
import { GlobalStateContext } from "../GlobalStateProvider";

function Home() {
  const { myCoursesNewQuestions, MyReplies, MyQuestions, MyAnswers } =
    useContext(GlobalStateContext);

  const homePageList = [
    //!! typeof(rows) = Array() !!//
    {
      scope: "default",
      title: "New questions in courses enrolled",
      rows: myCoursesNewQuestions,
    },
    {
      scope: "default",
      title: "Replies",
      rows: [
        ["Cras justo odio"],
        ["Dapibus ac facilisis in"],
        ["Morbi leo risus"],
        ["Porta ac consectetur ac"],
        ["Vestibulum at eros"],
      ],
    },
    {
      scope: "default",
      title: "My questions",
      rows: [
        ["Cras justkjkkkkko odio"],
        ["Dapibus ac facilisis in"],
        ["Morbi leo risus"],
        ["Porta ac consectetur ac"],
        ["Vestibulum at eros"],
      ],
    },
    {
      scope: "default",
      title: "My answers",
      rows: [
        ["Cras justo odio"],
        ["Dapibus ac facilisis in"],
        ["Morbi leo risus"],
        ["Porta ac consectetur ac"],
        ["Vestibulum at eros"],
      ],
    },
  ];

  const [homeLists, setHomeLists] = useState(homePageList);

  console.log(myCoursesNewQuestions)

  return (
    <>
      <Row lg={12} className="py-0 header">
        <Col>
          <h3>Hi, Name Surname!</h3>
        </Col>
      </Row>
      <div className="home-page-table">
        {<ListGroup lists={homeLists} cols={2} tiled rounded dotted />}
      </div>
    </>
  );
}

export default Home;
