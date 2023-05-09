import { Breadcrumb } from "react-bootstrap";
import "./stylesheet/BreadCrumb.scss";
import { matchPath, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const breadcrumbRecord = [
  {
    path: "/",
    title: "Home",
    children: [
      {
        path: "/replies",
        title: "Relies",
        children: [],
      },
      {
        path: "/newquestionsincoursesenrolled",
        title: "Newly Enrolled Courses",
        children: [],
      },
      {
        path: "/myquestions",
        title: "My Questions",
        children: [],
      },
      {
        path: "/myanswers",
        title: "My Answers",
        children: [],
      },
    ],
  },
  {
    path: "/courses",
    title: "Courses",
    children: [],
  },
  {
    path: "/simulationview",
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
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/settings",
    title: "Setting",
  },
  {
    path: `/addquestion`,
    title: `Add Questions`,
    children: [],
  },
  {
    path: `/profile`,
    title: `Profile`,
    children: [],
  },
  {
    path: `/bookmarks`,
    title: `Bookmarks`,
    children: [],
  },
];

export default function BreadCrumb(props) {
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

  const location = useLocation();

  const [locationState, setLocationState] = useState(location);
  useEffect(() => {
    setLocationState(location);
    console.warn(crumbPathArr);
    console.log(`current location: ${location.pathname}`);
  }, [location, setLocationState]);

  const [crumbPathArr, setCrumbPathArr] = useState(
    // find object of path from the root lvl
    // default = (Home, "/") => only toggle the root
    breadcrumbRecord.filter((e) => {
      if (location.pathname === e.path) {
        return e;
      }
    })
  );

  function getStringArray(arr, str) {
    const index = arr.indexOf(str);

    if (index === -1) {
      return arr;
    }
    return arr.slice(0, index + 1);
  }

  // when path change => reload || redirect
  useEffect(() => {
    let isRoot = false;

    breadcrumbRecord.forEach((e) => {
      if (locationState.pathname === e.path) {
        isRoot = true;
      }
    });

    // if the reloaded page is root => re-route path
    isRoot &&
      setCrumbPathArr(
        breadcrumbRecord.filter((e) => {
          if (locationState.pathname === e.path) {
            isRoot = true;
            return e;
          }
        })
      );

    // if the reloaded page is not root => find parent-child path
    if (!isRoot) {
      let isNew = true;
      let foundPath;
      crumbPathArr.forEach((i) => {
        if (locationState.pathname === i.path) {
          isNew = false;
        }
      });
      // if reloaded page is one of the previous path
      if (!isNew) {
        foundPath = getStringArray(crumbPathArr, locationState.pathname);
      }
      // if it is a new path
      else {
        foundPath = findChild(crumbPathArr, locationState.pathname);
      }

      setCrumbPathArr(foundPath);
    }
  }, [location, locationState, setLocationState]);

  const findChild = (path, dest) => {
    const root = path[path.length - 1];

    // the end of path
    if (!root) {
      return path;
    }

    // recursively find the last child
    for (let i = 0; i < root.children.length; i++) {
      if (dest.includes(root.children[i].path)) {
        path.push(root.children[i]);
        findChild(path, dest);
        break;
      }
    }

    return path;
  };

  return (
    <>
      <Breadcrumb className="breadcrumb">
        {crumbPathArr?.map((e, index) => {
          return index === crumbPathArr.length - 1 ? (
            <Breadcrumb.Item
              active
              href={e.path}
              key={"breadcrumb-index:" + index + e.path}
            >
              {e.title}
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item
              href={e.path}
              key={"breadcrumb-index:" + index + e.path}
            >
              {e.title}
            </Breadcrumb.Item>
          );
        })}
      </Breadcrumb>
    </>
  );
}
