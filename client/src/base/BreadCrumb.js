import {Breadcrumb} from "react-bootstrap";
import "./stylesheet/BreadCrumb.scss"
import {useLocation} from "react-router-dom";


export default function BreadCrumb (props) {

    const location = useLocation()


    const breadcrumbRecord = [
        {
            path: "/",
        },
        {
            path: "/courses"
        },
        {
            path:"/simulationview"
        },
        {
            path: "/settings"
        }
    ];


    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item href="/">hi</Breadcrumb.Item>
            </Breadcrumb>
        </>
    )
}