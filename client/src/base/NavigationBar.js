import {Navbar, Nav, NavDropdown, Button, Image, Form, OverlayTrigger, Popover} from "react-bootstrap";
import {Link} from "react-router-dom";
// // <<<<<<< HEAD
// import {iconLogout, iconAdmin} from "../icons.js";
// import {logoSkeeelled} from "../img/";
// import styles from "./navigationBar/navigationBar.module.scss";
// import "./NavigationBar.css"
// =======
import {iconUser, iconLogout, iconAdmin} from "../icons.js";
import {logoSkeeelledLight} from "../img/";
import "./NavigationBar.css";
// >>>>>>> origin/frontend-donato

function NavigationBar(props) {
	return (
		<Navbar id={"navbar"} bg={false ? "dark" : "light"} variant={false ? "dark" : "light"}>
			
			<Link to={"/"}>
{/*<<<<<<< HEAD*/}
				<Navbar.Brand><Image id={"navbar-logo-skeeelled"} src={logoSkeeelledLight}/></Navbar.Brand>
{/*=======*/}
				{/*<Navbar.Brand><Image src={logoSkeeelledLight} className="logo"/></Navbar.Brand>*/}
{/*>>>>>>> origin/frontend-donato*/}
			</Link>

			{props.admin ? (
				<Link to='/admin/list'>
					<Navbar.Brand>{iconAdmin} Admin panel</Navbar.Brand>
				</Link>
			) : null}

{/*<<<<<<< HEAD*/}
			<Nav.Link id={"course-link"}>Courses</Nav.Link>
			
			{/*props.user.isProfessor*/ true ? <Nav.Link id={"add-question-link"} >Add question</Nav.Link> : null}

			{props.logged ? (<>
				<Link to={"/"} onClick={props.logout} className="mx-2">
					<Navbar.Brand>Logout {iconLogout}</Navbar.Brand>
				</Link>
			</>) : null}

			<Nav id={"user-dropdown"}>
				<Navbar.Collapse >
					<NavDropdown align={{ lg: 'end' }}
								 title="user.img"
								 id="dropdown-menu-align-responsive-2">
						<NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.2">Bookmarks</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.3">Settings</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item href="#action/3.1">Dark</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.2">Show hints</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.3">Show discussion</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
					</NavDropdown>
{/*=======*/}
{/*			/!*<Nav.Link href="" className="mx-2 mr-auto">Courses</Nav.Link>*!/*/}
{/*			*/}
{/*			/!*props.user.isProfessor*/ /*true && <Nav.Link href="" className="mx-2">Add question</Nav.Link>}*/}
{/*			*/}
{/*			/!*<Nav className="justify-content-end">*!/*/}
{/*			/!*	<Navbar.Collapse className="mr-4">*!/*/}
{/*			/!*			<NavDropdown title={iconUser}>*!/*/}
{/*			/!*				<NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>*!/*/}
{/*			/!*				<NavDropdown.Item href="#action/3.2">Bookmarks</NavDropdown.Item>*!/*/}
{/*			/!*				<NavDropdown.Item href="#action/3.3">Settings</NavDropdown.Item>*!/*/}
{/*			/!*				<NavDropdown.Divider />*!/*/}
{/*			/!*				<NavDropdown.Item href="#action/3.1">Dark</NavDropdown.Item>*!/*/}
{/*			/!*				<NavDropdown.Item href="#action/3.2">Show hints</NavDropdown.Item>*!/*/}
{/*			/!*				<NavDropdown.Item href="#action/3.3">Show discussion</NavDropdown.Item>*!/*/}
{/*			/!*				{props.logged && <>*!/*/}
{/*			/!*					<NavDropdown.Divider />*!/*/}
{/*			/!*					<NavDropdown.Item onClick={props.logout}>Logout {iconLogout}</NavDropdown.Item>*!/*/}
{/*			/!*				</>}*!/*/}
{/*			/!*			</NavDropdown>*!/*/}
{/*>>>>>>> origin/frontend-donato*/}
				</Navbar.Collapse>
			</Nav>



			{/* <Form.Switch type="switch" id="custom-switch" label="Check this switch"/> */}
			{/* <OverlayTrigger
				trigger="click"
				key="bottom"
				placement="bottom"
				overlay={
					<Popover id="popover-positioned-bottom">
					<Popover.Header as="h3">Popover bottom</Popover.Header>
					<Popover.Body>
						<strong>Holy guacamole!</strong> Check this info.
					</Popover.Body>
					</Popover>
				}
				>
				<Button variant="secondary">Popover on bottom</Button>
				</OverlayTrigger>
			*/}

		</Navbar>
	);
}

export default NavigationBar;
