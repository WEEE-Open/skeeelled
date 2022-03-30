import {Navbar, Nav, NavDropdown, Image, Form, OverlayTrigger, Popover} from "react-bootstrap";
import {Link} from "react-router-dom";
import {iconUser, iconLogout, iconAdmin} from "../icons.js";
import "./NavigationBar.css";

function NavigationBar(props) {
	return (
		<Navbar bg={props.dark ? 'dark' : 'light'} variant={props.dark ? 'dark' : 'light'}>
			
			<Link to={"/"}>
				<Navbar.Brand><Image src={props.dark ? "img/logoSkeeelledDark.svg" : "img/logoSkeeelledLight.svg"} className="logo"/></Navbar.Brand>
			</Link>

			{props.admin ? (
				<Link to='/admin/list'>
					<Navbar.Brand>{iconAdmin} Admin panel</Navbar.Brand>
				</Link>
			) : null}

			<Link to="/courses" className="mx-2 mr-auto navLink">Courses</Link>
			
			{/*props.user.isProfessor*/ true && <Link to="" className="navLink mx-2">Add question</Link>}

			<Nav className="justify-content-end">
				<Navbar.Collapse className="mr-4">
						<NavDropdown title={iconUser}>
							<NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.2">Bookmarks</NavDropdown.Item>
							<NavDropdown.Item href="#action/3.3">Settings</NavDropdown.Item>
							<NavDropdown.Divider/>
							<Form.Switch label="Dark" id="custom-switch-dark" defaultChecked={props.dark} onChange={() => props.setdark(!props.dark)}/>
							<Form.Switch label="Show hints" id="custom-switch-hint"/>
							<Form.Switch label="Show discussion" id="custom-switch-disc"/>
							{props.logged && <>
								<NavDropdown.Divider/>
								<NavDropdown.Item onClick={props.logout}>Logout {iconLogout}</NavDropdown.Item>
							</>}
						</NavDropdown>
				</Navbar.Collapse>
			</Nav>



			{/* <Form.Switch label="Check this switch" type="switch" id="custom-switch"/> */}

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
