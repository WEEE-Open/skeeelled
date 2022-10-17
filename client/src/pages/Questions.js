import {
  Button,
  Container,
  Row,
  Col,
  Pagination,
  Card,
  Image,
  Stack,
} from "react-bootstrap";

import { useEffect, useState } from "react";
// import "./Questions.css";
import "./stylesheet/Questions.css";
import { List, Recent, SearchBar, Suggestion } from "../base/";
import { Link, useLocation } from "react-router-dom";

function PaginationRow(props) {
  let [active, setActive] = useState(1);
  let items = [];
  for (let num = 1; num <= 5; num++) {
    items.push(
      <Pagination.Item
        key={num}
        active={num === active}
        onClick={() => {
          setActive((active = num));
        }}
      >
        {num}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.First />
      {items}
      <Pagination.Last />
    </Pagination>
  );
}

const Questions = () => {
  const fakeQuestions = [
    {
      id: 1,
      question: "What is a vector?",
      author: "Donato",
      createdat: "15:20 12/01/2021",
      tags: ["vectors"],
      excerpt: "Cras justo odio...",
    },
    {
      id: 2,
      question: "Who is Maxwell?",
      author: "Jim",
      createdat: "17:30 13/02/2021",
      tags: ["physics"],
      excerpt: "Cras justo odio...",
    },
    {
      id: 3,
      question: "How many meters per second?",
      author: "Derek",
      createdat: "19:40 14/03/2021",
      tags: ["physics", "kinematic"],
      excerpt: "Cras justo odio...",
    },
  ];

  const [questions, setQuestions] = useState(fakeQuestions /*[]*/);
  const [suggestions, setSuggestions] = useState(fakeQuestions /*[]*/);
  const suggestionType = ["Latest", "Hottest"];

  // hook for responsive react
  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => {
        setMatches(media.matches);
      };
      window.addEventListener("resize", listener);
      return () => window.removeEventListener("resize", listener);
    }, [matches, query]);

    return matches;
  };

  // TODO: also take a look at Bootstrap class infixes to detect the current breakpoint
  // to see which approach is better -- https://getbootstrap.com/docs/5.1/layout/breakpoints/
  const isDesktop = useMediaQuery("(min-width: 960px)");

  const locationState = useLocation().state;

  return (
    <>
      <Container>
        <Stack gap={4}>
          {isDesktop ? (
            <Row key={isDesktop}>
              <Col>
                <Container className="container">
                  <Row lg={12} className="header">
                    <Col>
                      <div className="right-button">
                        <Button
                          className="add-question-button"
                          onClick={() => {}}
                        >
                          {/*<Image*/}
                          {/*    className="add-icon"*/}
                          {/*    src={*/}
                          {/*      process.env.PUBLIC_URL + "/icons/ADD_WHITE.svg"*/}
                          {/*    }*/}
                          {/*    width="13px"*/}
                          {/*/>*/}
                          {" Enroll in course"}
                        </Button>

                        <Link
                          to={{
                            pathname:
                              "/startsimulation/" + locationState.courseId,
                          }}
                          state={{
                            courseId: locationState.courseId,
                            title: locationState.title,
                          }}
                        >
                          <Button className="start-simulation-button">
                            {/*<Image*/}
                            {/*    className="add-icon"*/}
                            {/*    src={*/}
                            {/*      process.env.PUBLIC_URL +*/}
                            {/*      "/icons/SIMULATION RESULTS_WHITE.svg"*/}
                            {/*    }*/}
                            {/*    width="13px"*/}
                            {/*/>*/}
                            {" Start Simulation"}
                          </Button>
                        </Link>
                      </div>
                      <List
                        scope="questions"
                        title={locationState.title}
                        rows={questions}
                      />
                      <PaginationRow />
                    </Col>
                    <Col className="d-sm-inline-block col-md-4">
                      <Stack gap={4}>
                        {suggestionType.map((type, i) => {
                          return (
                            <Row key={i}>
                              <Suggestion
                                scope={"suggestion"}
                                title={type + " Questions"}
                                rows={suggestions}
                              />
                            </Row>
                          );
                        })}
                      </Stack>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          ) : (
            // mobile configuration
            <>
              <Row>
                <Container className="container">
                  <Row lg={12} className="header">
                    <Col>
                      <div className="right-button">
                        <Button
                          className="add-question-button"
                          onClick={() => {}}
                        >
                          {/*<Image*/}
                          {/*    className="add-icon"*/}
                          {/*    src={*/}
                          {/*      process.env.PUBLIC_URL + "/icons/ADD_WHITE.svg"*/}
                          {/*    }*/}
                          {/*    width="13px"*/}
                          {/*/>*/}
                          {" Enroll in course"}
                        </Button>

                        <Link
                          to={{
                            pathname:
                              "/startsimulation/" + locationState.courseId,
                          }}
                          state={{
                            courseId: locationState.courseId,
                            title: locationState.title,
                          }}
                        >
                          <Button className="start-simulation-button">
                            {/*<Image*/}
                            {/*    className="add-icon"*/}
                            {/*    src={*/}
                            {/*      process.env.PUBLIC_URL +*/}
                            {/*      "/icons/SIMULATION RESULTS_WHITE.svg"*/}
                            {/*    }*/}
                            {/*    width="13px"*/}
                            {/*/>*/}
                            {" Start Simulation"}
                          </Button>
                        </Link>
                      </div>
                      <List
                        scope="questions"
                        title={locationState.title}
                        rows={questions}
                      />
                    </Col>

                    <Col className="pagination" lg="12" sm="12" md="12">
                      <PaginationRow />
                    </Col>
                  </Row>
                </Container>
              </Row>
              <Row>
                <Stack gap={4}>
                  {suggestionType.map((type, i) => {
                    return (
                      <Col key={i}>
                        <Suggestion
                          scope={"suggestion"}
                          title={type + " Questions"}
                          rows={suggestions}
                        />
                      </Col>
                    );
                  })}
                </Stack>
              </Row>
            </>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default Questions;
