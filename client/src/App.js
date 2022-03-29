import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useState, useEffect} from "react";
import {Container, Row, Col, Alert, Button} from "react-bootstrap";
import {Routes, Route, Navigate as Redirect, Link} from "react-router-dom";
 
import {NavigationBar, Footer, DebugPaths} from "./base/";
import {Answers, CoursesList, Exam, LoginForm, MyQuestions, Profile, Questions} from "./pages/";
// import parsedQuestions from "./constants/parsed";
// import API from './api/API'

function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [admin, setAdmin] = useState(false);
	const [message, setMessage] = useState("");

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
		<Container fluid>
			<Row>
				<Col className='px-0'>
					<NavigationBar logged={loggedIn} logout={doLogout} setlogged={setLoggedIn}/>
				</Col>
			</Row>
			<Row className='my-4'>
				<Col xs={6} className='mx-auto'>
					{message &&
						<Alert variant={message.type} onClose={() => setMessage("")} dismissible={!message.noclose}>
							{message.msg}
						</Alert>
					}
				</Col>
			</Row>
			<DebugPaths/>
			<Row className='my-4'>
				<Col xs={10} md={8} className='mx-auto'>
					{/*
					<Exam question={parsedQuestions.quiz.question} />
					*/}
					{loggedIn ? <Routes>
						<Route path="/*" element={<Redirect to="/profile"/>}/>
						<Route path="/profile" element={<Profile/>}/>
						<Route path="/courses" element={<CoursesList/>}/>
						<Route path="/course/:coursecode" element={<Questions/>}/>
						<Route path="/question/:questionid" element={<Answers/>}/>
						<Route path="/discussion/:questionid" element={<p>Work in progress</p>}/>
						<Route path="/simulation" element={<p>Work in progress</p>}/>
						<Route path="/todel" element={<Exam/>}/>
						{/* <MyQuestions /> */}
					</Routes> : <Routes>
						<Route path="/*" element={<Redirect to="/login"/>}/>
						<Route path="/login" element={<LoginForm login={() => setLoggedIn(true)}/>}/>
					</Routes>}
				</Col>
			</Row>
			<Row>
				<Footer/>
			</Row>
		</Container>
	);
}

export default App;
