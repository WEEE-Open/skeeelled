import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Routes as Switch, Route, Navigate as Redirect } from "react-router-dom";
import LoginForm from "./pages/LoginForm.js";
import CoursesList from "./pages/CoursesList.js";
import NavigationBar from "./base/navigationBar/NavigationBar.jsx";
import Questions from "./pages/questions";
import Answers from "./pages/answers";
import Profile from "./pages/profile";
import MyQuestions from "./pages/myQuestions";
import Exam from "./pages/exam";
import parsedQuestions from "./constants/parsed";
// import API from './API'

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
					{message ? (
						<Alert
							variant={message.type}
							onClose={() => setMessage("")}
							dismissible={!message.noclose}
						>
							{message.msg}
						</Alert>
					) : null}
				</Col>
			</Row>
			<Row className='my-4'>
				<Col xs={10} md={8} className='mx-auto'>
					{/* <Exam question={parsedQuestions.quiz.question} /> */}
					{/* {loggedIn ? <CoursesList/> : <LoginForm login={() => setLoggedIn(true)}/>} */}
					{loggedIn ? <>
						{/* <CoursesList/> */}
						{/* <Questions/> */}
						<Answers/>
						{/* <Profile/> */}
						{/* <MyQuestions /> */}
					</> : <LoginForm login={() => setLoggedIn(true)}/>}
					{/* <span onClick={() => setLoggedIn(true)}>CLICK TO LOGIN</span> */}
				</Col>
			</Row>
		</Container>
	);
}

export default App;
