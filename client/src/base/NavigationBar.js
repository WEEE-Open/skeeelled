import {Navbar, Nav, NavDropdown, Button, Image, Form, OverlayTrigger, Popover} from "react-bootstrap";
import {Link} from "react-router-dom";
import {iconLogout, iconAdmin} from "../icons.js";
import {logoSkeeelled} from "../img/";
import styles from "./navigationBar/navigationBar.module.scss";

function NavigationBar(props) {
	return (
		<Navbar bg={false ? "dark" : "light"} variant={false ? "dark" : "light"}>
			
			<Link to={"/"}>
				<Navbar.Brand><Image src={logoSkeeelled}/></Navbar.Brand>
			</Link>

			{props.admin ? (
				<Link to='/admin/list'>
					<Navbar.Brand>{iconAdmin} Admin panel</Navbar.Brand>
				</Link>
			) : null}

			<Button className="mx-2 mr-auto">Courses</Button>
			
			{/*props.user.isProfessor*/ true ? <Link to="/addquestion"><Button className="mx-2">Add question</Button></Link> : null}

			{props.logged ? (<>
				<Link to={"/"} onClick={props.logout} className="mx-2">
					<Navbar.Brand>Logout {iconLogout}</Navbar.Brand>
				</Link>
			</>) : null}

			<Nav>
				<Navbar.Collapse className="mr-4">
					<NavDropdown title="userimg">
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
