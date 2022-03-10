import {Image} from "react-bootstrap";
import {logoSkeeelled, logoSkeeell, logoWeeeOpen} from "../img/";

const cssTemp = {
	footer:{"text-align":"center"},
	logoSkeeelled:{height:"35px"},
	logoWeeeOpen:{height:"20px","margin-left":"10px"},
	logoSkeeell:{height:"90px","vertical-align":"-26.5pt"}
};

function Footer() {
	return (
		<div style={cssTemp.footer} className="mx-auto">
			<h5 className="mx-auto">
				<a href={"https://github.com/weee-open/skeeelled"}>
					<Image style={cssTemp.logoSkeeelled} src={logoSkeeelled} alt={"skeeelled"}/>
				</a>
                is a tool realized by 
				<a href={"https://weeeopen.polito.it"}>
					<Image style={cssTemp.logoWeeeOpen} src={logoWeeeOpen} alt={"WEEE Open"}/>
				</a>
			</h5>
			<h5 className="mx-auto">
                See more about
				<a href={"https://weeeopen.polito.it/skeeell"}>
					<Image style={cssTemp.logoSkeeell} src={logoSkeeell} alt={"skeeell"} />
				</a>
			</h5>
		</div>
	);
}

export default Footer;