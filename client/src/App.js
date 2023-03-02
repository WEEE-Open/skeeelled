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
  useSearchParams,
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
// import parsedQuestions from "./constants/parsed";
import API from './api/API';

function Login() {
  const [searchParams, setSearchParams] = useSearchParams();

  const token = searchParams.get("token");
  document.cookie.
  localStorage.setItem("token", token);

  return <Redirect to="/" />
}

function AppEntry() {
  const [token, setToken] = useState(null);
  const [loggedIn, setLoggedIn] = useState(true); // TODO: reset to false, true used for debugging purposes
  const [showHints, setShowHints] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    fetch("http://172.19.0.6:8000/v1/whoami", { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          window.location.replace("http://172.19.0.6:8000/saml/login");
        }
        setToken(res);
      })
      .catch((err) => {
        console.log("catch");
        console.log(err);
      })
  }, []);

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
      {/*<Row><BreadCrumb/></Row>*/}
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
        </Col>
      </Row>
      <Row>
        <Footer />
      </Row>
    </Container>
  );
}

function App() {
  return (
    <GlobalStateProvider>
      <Routes>
        <Route path="/postLogin" element={<Login />} />
        <Route path="/*" element={<AppEntry />} />
      </Routes>
    </GlobalStateProvider>
  );
}

export default App;
