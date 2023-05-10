import { Row, Col, Card } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import "./stylesheet/Home.css";
import { ListGroup, SearchBar } from "../base/";
import API from "../api/API";
import isLabelEnd from "katex/dist/katex.mjs";
import { GlobalStateContext } from "../GlobalStateProvider";

function Home() {
  const { userID, userInfo, MyReplies, MyQuestions, MyAnswers } =
    useContext(GlobalStateContext);

  const [myCourseNewQuestions, setMyCourseNewQuestions] = useState([])

  const homePageList = [
    //!! typeof(rows) = Array() !!//
    {
      scope: "default",
      title: "New questions in courses enrolled",
      rows: myCourseNewQuestions,
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

  function homeCardListingTruncate (htmlText) {

    const strTruncate = (str) => {
      let arr = str.split(" ").slice(0, 5);
      return arr.join(" ") + "..."
    }

    let span = document.createElement('span');
    span.innerHTML = htmlText;
    return strTruncate(span.textContent) || strTruncate(span.innerText);
  }


  // first render
  useEffect(()=>{
    // five items per page in Home page
    API.getMyCourseNewQuestions(userID, 5).then((questions) => {
      setMyCourseNewQuestions(questions.map((x) => [homeCardListingTruncate(x.questiontext.text)]));
    });
  }, [])


  useEffect(()=> {
    setHomeLists(
        [
          {
            scope: "default",
            title: "New questions in courses enrolled",
            rows: myCourseNewQuestions,
          },
          ...homePageList.slice(1)
        ]
    )
  }, [myCourseNewQuestions])

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
