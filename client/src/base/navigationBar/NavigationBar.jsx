import { Navbar, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { iconLogout, iconAdmin, iconLogo } from "../../icons.js";
import logo from "../../logo.svg";
import styles from "./navigationBar.module.scss";

function NavigationBar(props) {
	return (
		<Navbar bg='light' variant='light'>
			{props.admin ? (
				<Link to='/admin/list'>
					<Navbar.Brand>{iconAdmin} Admin panel</Navbar.Brand>
				</Link>
			) : null}
			<Link to={"/"}>
				<Navbar.Brand><img src={logo}/></Navbar.Brand>
			</Link>
			{props.logged ? (<>
				<Form className="mx-auto w-25">
					<Form.Control type="text" placeholder="Search" onChange={() => {}}/>
				</Form>
				<Link to={"/"} onClick={props.logout}>
					<Navbar.Brand>Logout {iconLogout}</Navbar.Brand>
				</Link>
			</>) : null}
		</Navbar>
	);
}

export default NavigationBar;
