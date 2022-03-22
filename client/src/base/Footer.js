import {Image} from "react-bootstrap";
// import {logoSkeeelledLight, logoSkeeellLight, logoWeeeOpen} from "../img";
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
                    <Image className="logoSkeeelled" src={"img/logoSkeeelledLight.svg"} alt={"skeeelled"}/>
                </a>
                is a tool realized by 
                <a href={"https://weeeopen.polito.it"}>
                    <Image className="logoWeeeOpen" src={"img/logoWeeeOpen.svg"} alt={"WEEE Open"}/>
                </a>
            </h5>
            <h5 className="mx-auto">
                See more about
                <a href={"https://weeeopen.polito.it/skeeell"}>
                    <Image className="logoSkeeell" src={"img/logoSkeeellLight.svg"} alt={"skeeell"} />
                </a>
            </h5>
        </div>
    );
}

export default Footer;