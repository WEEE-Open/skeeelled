import {Image} from "react-bootstrap";
import {logoSkeeelledLight, logoSkeeellLight, logoSkeeelledDark, logoSkeeellDark, logoWeeeOpen} from "../img/";
import {logoSkeeelledLightFooter,logoSkeeellLightFooter, logoSkeeelledDarkFooter,logoSkeeellDarkFooter} from "../img/";
import "./Footer.css";

function Footer() {
	return (
		<div id={"footer"} className="mx-auto">
			<h5 id={"skeeelled"} className="mx-auto">
				<a id={"skeeelled-logo-link"} href={"https://github.com/weee-open/skeeelled"}>
					<Image id={"skeeelled-logo"} src={logoSkeeelledLightFooter} alt={"skeeelled"}/>
				</a>
				is a tool realized by
				<a href={"https://weeeopen.polito.it"}>
					<Image id={"weee-open-logo"} src={logoWeeeOpen} alt={"WEEE Open"}/>
				</a>
			</h5>
			<h5 id={"skeeell"} className="mx-auto">
                See more about
				<a href={"https://weeeopen.polito.it/skeeell"}>
					<Image id={"skeeell-logo"} src={logoSkeeellLight} alt={"skeeell"} />
				</a>
			</h5>
		</div>
	);

}

export default Footer;