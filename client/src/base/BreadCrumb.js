import {Breadcrumb} from "react-bootstrap";
import "./stylesheet/BreadCrumb.scss"
import {matchPath, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";


export default function BreadCrumb (props) {

    const fakeCourses = [
        { code: "A0B1C2", course: "Analysis 1", cfu: 10, professor: "Mario Rossi" },
        {
            code: "D3E4F5",
            course: "Physics 1",
            cfu: 10,
            professor: "Stefano Bianchi",
        },
        {
            code: "G6H7I8",
            course: "Geometry",
            cfu: 10,
            professor: "Giuseppe Verdi",
        },
    ];

    const breadcrumbRecord = [
        {
            path: "/",
            title: "Home",
            children: [
                {
                    path: "/listfullpage/replies",
                    title: 'Relies',
                    children: []
                },
                {
                    path: "/listfullpage/newquestionsincoursesenrolled",
                    title: 'Newly Enrolled Courses',
                    children: []
                },
                {
                    path: "/listfullpage/myquestions",
                    title: 'My Questions',
                    children: []
                },
                {
                    path: "/listfullpage/myanswers",
                    title: 'My Answers',
                    children: []
                }
            ]
        },
        {
            path: "/courses",
            title: "Courses",
            children: []
        },
        {
            path:"/simulationview",
            title: "Simulation Preview",
            children: [
                {
                    path: `/startsimulation`,
                    title: `Simulation Setup`,
                    children: [
                        {
                            path: `/simulation`,
                            title: `Simulation`,
                            children: [
                                {
                                    path: `/simulationresult`,
                                    title: `Simulation Result`,
                                    children: []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            path: "/settings",
            title: "Setting"
        },
        {
            path: `/addquestion`,
            title: `Add Questions`,
            children: []
        },
        {
            path: `/profile`,
            title: `Profile`,
            children: []
        },
        {
            path: `/bookmarks`,
            title: `Bookmarks`,
            children: []
        }
    ];

    const location = useLocation()

    // record thee
    const [crumbPathArr,setCrumbPathArr] = useState(breadcrumbRecord.filter((e)=> {
        if (location.pathname === e.path) {
            return e
        }}))

    useEffect(()=>{
        let isRoot = false;

        // if the reloaded page is root => re-route path
        setCrumbPathArr(breadcrumbRecord.filter((e)=>{
            if (location.pathname === e.path) {
                isRoot = true;
                return e
            }
        }))
        // if the reloaded page is not root => find parent-child path
        if (!isRoot) {
            setCrumbPathArr(findChild(crumbPathArr,location.pathname))
        }

        console.log(crumbPathArr);
        console.log(`location: ${location.pathname}`)
    },[location, ])

    const findChild = (path, dest) => {
        let i;
        const root = path[path.length -1]

        if (!root.children) {
            return path;
        }

        for (i=0; i<(root.children).length; i++) {
            if (dest.includes(root.children[i].path)) {
                    path.push(root.children[i])
                }
        }

       return path

    }

    return (
        <>
            <Breadcrumb>
                {
                    crumbPathArr.map((e,index)=> {
                        return index === crumbPathArr.length -1?<Breadcrumb.Item active href={e.path}>{e.title}</Breadcrumb.Item>:<Breadcrumb.Item href={e.path}>{e.title}</Breadcrumb.Item>
                    })
                }
            </Breadcrumb>
        </>
    )
}