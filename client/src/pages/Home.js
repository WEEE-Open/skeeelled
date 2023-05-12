import { Row, Col, Card } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import "./stylesheet/Home.css";
import { ListGroup, SearchBar } from "../base/";
import API from "../api/API";
import isLabelEnd from "katex/dist/katex.mjs";
import { GlobalStateContext } from "../GlobalStateProvider";
import { extractContent, strTruncate } from "../utils";

const homePageList = [
  //!! typeof(rows) = Array() !!//
  {
    scope: "default",
    title: "New questions in courses enrolled",
    rows: [],
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

function Home() {
  const { userID, userInfo } = useContext(GlobalStateContext);

  const [homeLists, setHomeLists] = useState(homePageList);
  const [myCoursesNewQuestions, setMyCoursesNewQuestions] = useState([]);

  useEffect(() => {
    // get my course new questions
    API.getMyCourseNewQuestions(userID, 5).then((questions) => {
      console.log("home questions", questions);
      const rows = questions.map((x) => [strTruncate(extractContent(x.questiontext.text))])
      setHomeLists((prev) => {
        prev[0].rows = rows;
        return prev;
      });
      setMyCoursesNewQuestions(rows);
    });
  }, [userID]);

  return (
    <>
      <Row lg={12} className="py-0 header">
        <Col>
          <h3>{"Hi, " + userInfo.name + " " + userInfo.surname + " !"}</h3>
        </Col>
      </Row>
      <div className="home-page-table">
        {<ListGroup lists={homeLists} cols={2} tiled rounded dotted />}
      </div>
    </>
  );
}

export default Home;
