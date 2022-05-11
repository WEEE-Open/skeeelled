import { List, Recent } from "../base";
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
import "./Questions.css";
import { SearchBar, Suggestion } from "../base/";
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
  /** Mock courses **/
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
          <Row>
// frontend-donato
            <Col>
              <Card body>
                <h3 className="listQuestionsTitle">
                  Physics I
                  <Link to="/simulation"><Button className="right-button">Start simulation</Button></Link>
                  <Button className="right-button" onClick={() => {}}>Add course</Button>
                </h3>
                <Row>
                  <Col className="listQuestionsTitle">
                    <SearchBar />
                  </Col>
                </Row>
                <Row lg={12} className="header">
                  <Col>
                    <List
                      scope="questions"
                      title="Physics I"
                      rows={questions}
                    />
                  </Col>
                  <Col className="pagination" lg="12" sm="12" md="12">
                    <Pagination>
                      {[
                        <Pagination.Item key={1} active>
                          {1}
                        </Pagination.Item>,
                        <Pagination.Item key={2} active={false}>
                          {2}
                        </Pagination.Item>,
                        <Pagination.Item key={3} active={false}>
                          {3}
                        </Pagination.Item>,
                        <Pagination.Item key={4} active={false}>
                          {4}
                        </Pagination.Item>,
                        <Pagination.Item key={5} active={false}>
                          {5}
                        </Pagination.Item>,
                        <Pagination.Item key={6} active={false}>
                          {6}
                        </Pagination.Item>,
                      ]}
                    </Pagination>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col className="d-none d-md-inline-block col-md-4">
              <Row>
                <Suggestion
                  scope={"suggestion"}
                  title={"Latest Questions"}
                  rows={suggestions}
                />
              </Row>
              <Row>
                <Suggestion
                  scope={"suggestion"}
                  title={"Hottest Questions"}
                  rows={suggestions}
                />
              </Row>
            </Col>
// =======
            <Link
              to={{ pathname: "/startsimulation/" + locationState.courseId }}
              state={{
                courseId: locationState.courseId,
                title: locationState.title,
              }}
            >
              <Button className="flex-md" variant="outline-success">
                Start Simulation
              </Button>
            </Link>
// >>>>>>> master
          </Row>
          {isDesktop ? (
            <Row>
              <Col>
                <Card body>
                  <Container className="container">
                    <Card body>
                      <Row lg={12} className="header">
                        <Col>
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
                    </Card>
                  </Container>
                </Card>
              </Col>
              <Col className="d-sm-inline-block col-md-4">
                <Stack gap={4}>
                  {suggestionType.map((type) => {
                    return (
                      <Row>
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
          ) : (
            <Stack gap={4}>
              <Row>
                <Card body>
                  <Container className="container">
                    <Card body>
                      <Row lg={12} className="header">
                        <Col>
                          <List
                            scope="questions"
                            title="Physics I"
                            rows={questions}
                          />
                        </Col>
                        <Col className="pagination" lg="12" sm="12" md="12">
                          <PaginationRow />
                        </Col>
                      </Row>
                    </Card>
                  </Container>
                </Card>
              </Row>
              <Row md={2} sm={2}>
                {suggestionType.map((type) => {
                  return (
                    <Col className="col-md-6">
                      <Suggestion
                        scope={"suggestion"}
                        title={type + " Questions"}
                        rows={suggestions}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default Questions;
