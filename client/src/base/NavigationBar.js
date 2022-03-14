import {Navbar, Nav, NavDropdown, Button, Image, Form, OverlayTrigger, Popover} from "react-bootstrap";
import {Link} from "react-router-dom";
import {iconLogout, iconAdmin} from "../icons.js";
import {logoSkeeelled} from "../img/";
import styles from "./navigationBar/navigationBar.module.scss";
import "./NavigationBar.css"

function NavigationBar(props) {
	return (
		<Navbar id={"navbar"} bg={false ? "dark" : "light"} variant={false ? "dark" : "light"}>
			
			<Link to={"/"}>
				<Navbar.Brand><Image if={"navbar-logo-skeeelled"} src={logoSkeeelled}/></Navbar.Brand>
			</Link>

			{props.admin ? (
				<Link to='/admin/list'>
					<Navbar.Brand>{iconAdmin} Admin panel</Navbar.Brand>
				</Link>
			) : null}

			<Nav.Link id={"course-link"} className={"mr-auto"}>Courses</Nav.Link>
			
			{/*props.user.isProfessor*/ true ? <Nav.Link id={"add-question-link"} >Add question</Nav.Link> : null}

			{props.logged ? (<>
				<Link to={"/"} onClick={props.logout} className="mx-2">
					<Navbar.Brand>Logout {iconLogout}</Navbar.Brand>
				</Link>
			</>) : null}

			<Nav id={"user-dropdown"}>
				<Navbar.Collapse >
					<NavDropdown align={{ lg: 'start' }}
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
				</OverlayTrigger> */}


		</Navbar>
	);
}

export default NavigationBar;
