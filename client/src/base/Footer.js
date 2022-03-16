import {Image} from "react-bootstrap";
import {logoSkeeelledLight, logoSkeeellLight, logoWeeeOpen} from "../img";
// import {logoSkeeelled} from "../../public/img/logoSkeeelled.svg";
// import {logoSkeeell} from "../../public/img/logoSkeeell.svg";
// import {logoWeeeOpen} from "../../public/img/logoWeeeOpen.svg";
import "./Footer.css";
// const cssTemp = {
//     footer:{"text-align":"center"},
//     logoSkeeelled:{height:"35px"},
//     logoWeeeOpen:{height:"20px","margin-left":"10px"},
//     logoSkeeell:{height:"90px","vertical-align":"-26.5pt"}
// }

function Footer() {
    return (
        <div className="mx-auto footer">
            <h5 className="mx-auto">
                <a href={"https://github.com/weee-open/skeeelled"}>
                    <Image className="logoSkeeelled" src={logoSkeeelledLight} alt={"skeeelled"}/>
                </a>
                is a tool realized by 
                <a href={"https://weeeopen.polito.it"}>
                    <Image className="logoWeeeOpen" src={logoWeeeOpen} alt={"WEEE Open"}/>
                </a>
            </h5>
            <h5 className="mx-auto">
                See more about
                <a href={"https://weeeopen.polito.it/skeeell"}>
                    <Image className="logoSkeeell" src={logoSkeeellLight} alt={"skeeell"} />
                </a>
            </h5>
        </div>
    );
}

export default Footer;