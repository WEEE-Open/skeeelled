import { Modal, Form, Button, Alert } from 'react-bootstrap'
import { useState } from 'react'

function LoginForm(props) {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState('')

	function checkPassword(password) {
		if (password.length >= 6) return true
		return false
	}

	const handleSubmit = event => {
		event.preventDefault()
		setErrorMessage('')
		const credentials = { username, password }
		let valid = true
		if (username === '' || !checkPassword(password)) valid = false
		if (valid) {
			props.login(credentials)
		} else {
			setErrorMessage('Errors in the form')
		}
	}

	return (
		<Modal.Dialog>
			<Modal.Header>
				<Modal.Title>Login</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				{errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : null}
				<Form.Group controlId='username'>
					<Form.Label>Email</Form.Label>
					<Form.Control
						type='email'
						value={username}
						onChange={ev => setUsername(ev.target.value)}
					/>
				</Form.Group>
				<Form.Group controlId='password'>
					<Form.Label>Password</Form.Label>
					<Form.Control
						type='password'
						value={password}
						onChange={ev => setPassword(ev.target.value)}
					/>
				</Form.Group>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={handleSubmit}>Login</Button>
			</Modal.Footer>
		</Modal.Dialog>
	)
}

export default LoginForm
