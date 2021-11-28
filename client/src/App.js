import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Row, Col, Alert } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { Routes as Switch, Route, Navigate as Redirect } from 'react-router-dom'
import LoginForm from './pages/LoginForm.js'
import CoursesList from './pages/CoursesList.js'
import NavigationBar from './base/navigationBar/NavigationBar.js'
import Questions from './pages/questions/questions'
import Answers from './pages/answers/answers'
import Profile from './pages/profile/profile'
import MyQuestions from './pages/myQuestions/myQuestions'
// import API from './API'

function App() {
	const [loggedIn, setLoggedIn] = useState(false)
	// const [admin, setAdmin] = useState(false)
	const [message, setMessage] = useState('')

	useEffect(() => {
		if (!loggedIn) setMessage('')
	}, [loggedIn])

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
		setLoggedIn(false)
		// setAdmin(false)
	}

	return (
		<Container fluid>
			<Row>
				<Col className='px-0'>
					<NavigationBar logged={loggedIn} logout={doLogout} /* admin={admin} */ />
				</Col>
			</Row>
			<Row className='my-4'>
				<Col xs={6} className='mx-auto'>
					{message ? (
						<Alert
							variant={message.type}
							onClose={() => setMessage('')}
							dismissible={!message.noclose}
						>
							{message.msg}
						</Alert>
					) : null}
				</Col>
			</Row>
			<Row className='my-4'>
				<Col xs={10} md={8} className='mx-auto'>
					<Switch>
					{/* {loggedIn ? <CoursesList/> : <LoginForm login={() => setLoggedIn(true)}/>} */}
					{/* <Questions /> */}
					{/* <Answers /> */}
					{/* <Profile /> */}
					{/* <MyQuestions /> */}

					
					<Route exact path="/" element={<>
						{!loggedIn ? <Redirect to="/login"/> : <Redirect to="courses"/* "/profile" *//>}
					</>}/>
					<Route path="/login" element={<>
						{!loggedIn ? <LoginForm login={() => setLoggedIn(true)}/> : <Redirect to="/"/>}
					</>}/>
					<Route path="/profile" element={<>
						{!loggedIn ? <Redirect to="/"/> : null /* <ProfilePage/> */}
					</>}/>
					<Route path="/courses" element={<>
						{!loggedIn ? <Redirect to="/"/> : <CoursesList/>}
					</>}/>
					<Route path="/course/:code" element={<>
						{!loggedIn ? <Redirect to="/"/> : <Questions/>}
					</>}/>
					

					{/* <Switch>
						<Route
							exact
							path='/'
							render={() => (
								<>
									{loggedIn ? <Redirect to='list' /> : <Redirect to='/login' />}
								</>
							)}
						/>
						<Route
							path='/login'
							render={() => (
								<>
									{loggedIn ? (
										<Redirect to='/' />
									) : (
										<LoginForm login={() => {}} />
									)}
								</>
							)}
						/> */}
					{/* <Route path="/list" render={() => <>
              {!loggedIn ? <Redirect to="/"/> : <SGList/>}
            </>}/>
            <Route path="/studygroup/:code" render={({match}) => <>
              {!loggedIn ? <Redirect to="/"/> : <SGView code={match.params.code}/>}
            </>}/>
            <Route path="/meetings" render={() => <>
              {!loggedIn ? <Redirect to="/"/> : <MeetingsList/>}
            </>}/>
            <Route path="/admin/list" render={() => <>
              {!loggedIn ? <Redirect to="/"/> : <AdminSGList/>}
            </>}/>
            <Route path="/admin/studygroup/:code" render={({match}) => <>
              {!loggedIn ? <Redirect to="/"/> : <AdminSGView code={match.params.code}/>}
            </>}/>
            <Route path="/admin/new" render={() => <>
              {!loggedIn ? <Redirect to="/"/> : <NewSG setmsg={setMessage}/>}
            </>}/>
            <Route path="/groupadmin/studygroup/:code" render={({match}) => <>
              {!loggedIn ? <Redirect to="/"/> : <GroupSGView code={match.params.code}/>}
            </>}/>
            <Route path="/groupadmin/new/:code" render={({match}) => <>
              {!loggedIn ? <Redirect to="/"/> : <NewMeeting code={match.params.code} setmsg={setMessage}/>}
            </>}/> */}
					{/* </Switch> */}
					</Switch>
				</Col>
			</Row>
		</Container>
	)
}

export default App
