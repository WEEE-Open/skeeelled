import {Breadcrumb} from "react-bootstrap";
import "./stylesheet/BreadCrumb.scss"
import {useLocation} from "react-router-dom";


export default function BreadCrumb (props) {

    const breadcrumbRecord = [
        {
            path: "/",
            title: "Home",
            children: [
                {
                    path: "/",
                    title: "Home"
                }
            ]
        },
        {
            path: "/courses",
            title: "Courses"
        },
        {
            path:"/simulationview",
            title: "Simulation Preview"
        },
        {
            path: "/settings",
            title: "Setting"
        }
    ];


    return (
        <>
            {
                breadcrumbRecord.map((e) => {
                    let pathArrParse = e.path.split('/');
                    if (e.path === props.pathname) {
                        return (
                            <>
                                <Breadcrumb>
                                    <Breadcrumb.Item href={e.path}>{e.title}</Breadcrumb.Item>
                                </Breadcrumb>
                            </>
                        )
                    }
                })
            }
        </>
    )
}