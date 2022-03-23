import {Navbar, Nav, NavDropdown, Button, Image, Form, OverlayTrigger, Popover} from "react-bootstrap";
import {Link} from "react-router-dom";
import {iconUser, iconLogout, iconAdmin} from "../icons.js";
import {logoSkeeelledLight} from "../img/";
import "./NavigationBar.css";

function NavigationBar(props) {
	return (
		<Navbar id={"navbar"} bg={false ? "dark" : "light"} variant={false ? "dark" : "light"}>
			
			<Link to={"/"}>
				<Navbar.Brand><Image id={"navbar-logo-skeeelled"} src={logoSkeeelledLight}/></Navbar.Brand>
			</Link>

			{props.admin ? (
				<Link to='/admin/list'>
					<Navbar.Brand>{iconAdmin} Admin panel </Navbar.Brand>
				</Link>
			) : null}

			<Nav.Link id={"course-link"}>Courses</Nav.Link>
			
			{/*props.user.isProfessor*/ true ? <Nav.Link id={"add-question-link"} >Add question</Nav.Link> : null}

			{props.logged ? (<>
				<Link to={"/"} onClick={props.logout} className="mx-2">
					<Navbar.Brand id={"logout-icon"}>Logout {iconLogout}</Navbar.Brand>
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
				</Navbar.Collapse>
			</Nav>
		</Navbar>
	);
}

export default NavigationBar;
