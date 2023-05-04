import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import {
  Routes,
  Route,
  Navigate as Redirect,
  Link,
  useLocation,
} from "react-router-dom";
import {
  NavigationBar,
  Footer,
  DebugPaths,
  TextInput,
  BreadCrumb,
} from "./base/";
import {
  AddQuestion,
  Answers,
  CoursesList,
  Exam,
  Home,
  LoginForm,
  MyQuestions,
  MyComments,
  MyReplies,
  Profile,
  Questions,
  Replies,
  UserSettings,
  ListFullPage,
  Bookmarks,
  StartSimulation,
  Simulation,
  SimulationResult,
  SimulationAccess,
} from "./pages/";
import GlobalStateProvider from "./GlobalStateProvider";
import { MathJaxContext } from "better-react-mathjax";
// import parsedQuestions from "./constants/parsed";
// import API from './api/API'

function App() {
  const [loggedIn, setLoggedIn] = useState(true); // TODO: reset to false, true used for debugging purposes
  const [showHints, setShowHints] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!loggedIn) setMessage("");
  }, [loggedIn]);

  // useEffect(() => {
  // 	const checkAuth = async () => {
  // 		try {
  // 			const user = await API.getUserInfo()
  // 			setLoggedIn(true)
  // 			user.admin ? setAdmin(true) : setAdmin(false)
  // 		} catch (err) {
  // 			console.error(err.error)
  // 		}
  // 	}
  // 	checkAuth()
  // }, [])

  // const doLogin = async credentials => {
  // 	try {
  // 		const username = await API.login(credentials)
  // 		setLoggedIn(true)
  // 		setMessage({ msg: `Welcome, ${username}!`, type: 'success' })
  // 		const user = await API.getUserInfo()
  // 		user.admin ? setAdmin(true) : setAdmin(false)
  // 	} catch (err) {
  // 		setMessage({ msg: err, type: 'danger' })
  // 	}
  // }

  const doLogout = async () => {
    // await API.logout()
    setLoggedIn(false);
    setAdmin(false);
  };

  return (
    <MathJaxContext>
      <GlobalStateProvider>
        <Container fluid>
          <Row>
            <Col className="px-0">
              <NavigationBar
                dark={dark}
                setdark={setDark}
                logged={loggedIn}
                setlogged={setLoggedIn}
                showhints={showHints}
                setshowhints={setShowHints}
                showdiscussion={showDiscussion}
                setshowdiscussion={setShowDiscussion}
                logout={doLogout}
              />
            </Col>
          </Row>
          <Row>
            <BreadCrumb />
          </Row>
          <Row className="my-4">
            <Col xs={6} className="mx-auto">
              {message && (
                <Alert
                  variant={message.type}
                  onClose={() => setMessage("")}
                  dismissible={!message.noclose}
                >
                  {message.msg}
                </Alert>
              )}
            </Col>
          </Row>
          <DebugPaths />
          <Row className="my-4">
            <Col sm={11} md={10} className="mx-auto">
              {/*
            <Exam question={parsedQuestions.quiz.question} />
            */}
              {loggedIn ? (
                <Routes>
                  <Route path="/*" element={<Redirect to="/" />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<UserSettings />} />
                  <Route path="/courses" element={<CoursesList />} />
                  <Route path="/course/:courseid" element={<Questions />} />
                  <Route
                    path="/question/:questionid"
                    element={
                      <Answers
                        showhints={showHints}
                        showdiscussion={showDiscussion}
                      />
                    }
                  />
                  <Route path="/myquestions" element={<MyQuestions />} />
                  <Route path="/mycomments" element={<MyComments />} />
                  <Route path="/myreplies" element={<MyReplies />} />
                  <Route path="/discussion/:questionid" element={<Replies />} />
                  <Route
                    path="/simulation/:simulationType"
                    element={<Simulation />}
                  />
                  <Route path="/addquestion" element={<AddQuestion />} />
                  <Route path="/todel" element={<Exam />} />
                  <Route
                    path="/listfullpage/:listName"
                    element={<ListFullPage />}
                  />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route
                    path="/startsimulation/:courseName"
                    element={<StartSimulation />}
                  />
                  <Route
                    path="/simulationresult/:courseName"
                    element={<SimulationResult />}
                  />
                  <Route path="/simulationview" element={<SimulationAccess />} />
                  <Route
                    path="/python-editor"
                    element={<TextInput dark={dark} pythonQuestion />}
                  />{" "}
                  {/* For debugging purposes */}
                </Routes>
              ) : (
                <Routes>
                  <Route path="/*" element={<Redirect to="/login" />} />
                  <Route
                    path="/login"
                    element={<LoginForm login={() => setLoggedIn(true)} />}
                  />
                </Routes>
              )}
            </Col>
          </Row>
          <Row>
            <Footer />
          </Row>
        </Container>
      </GlobalStateProvider>
    </MathJaxContext>
    
  );
}

export default App;
