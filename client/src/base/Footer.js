import {Image} from "react-bootstrap";
import {logoSkeeelled, logoSkeeell, logoWeeeOpen, logoSkeeelledFooter} from "../img/";
import "./Footer.css";

// const cssTemp = {
// 	footer:{"text-align":"center"},
// 	logoSkeeelled:{height:"35px"},
// 	logoWeeeOpen:{height:"20px","margin-left":"10px"},
// 	logoSkeeell:{height:"90px","vertical-align":"-26.5pt"}
// };

function Footer() {
	return (
		<div id={"footer"} className="mx-auto"> {/*style={cssTemp.footer}*/}
			<h5 className="mx-auto">
				<a href={"https://github.com/weee-open/skeeelled"}>
					<Image id={"skeeep-logo"} src={logoSkeeelledFooter} alt={"skeeelled"}/> {/*style={cssTemp.logoSkeeelled}*/}
				</a>
                 is a tool realized by
				<a href={"https://weeeopen.polito.it"}>
					<Image id={"weee-open-logo"} src={logoWeeeOpen} alt={"WEEE Open"}/> {/*style={cssTemp.logoWeeeOpen}*/}
				</a>
			</h5>
			<h5 id={"skeeell"} className="mx-auto">
                See more about
				<a href={"https://weeeopen.polito.it/skeeell"}>
					<Image id={"skeeell-logo"} src={logoSkeeell} alt={"skeeell"} /> {/*style={cssTemp.logoSkeeell}*/}
				</a>
			</h5>
		</div>
	);
}

export default Footer;