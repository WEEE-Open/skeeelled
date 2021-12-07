import { Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { iconLogout, iconAdmin, iconLogo } from "../../icons.js";
import styles from "./navigationBar.module.scss";


function NavigationBar(props) {
	return (
		<Navbar bg='dark' variant='dark'>
			{props.admin ? (
				<Link to='/admin/list'>
					<Navbar.Brand>{iconAdmin} Admin panel</Navbar.Brand>
				</Link>
			) : null}
			<Link to={"/"}>
				<Navbar.Brand>{iconLogo}</Navbar.Brand>
			</Link>
			{props.logged ? (
				<Link to={"/"} onClick={props.logout}>
					<Navbar.Brand>Logout {iconLogout}</Navbar.Brand>
				</Link>
			) : null}
		</Navbar>
	);
}

export default NavigationBar;
