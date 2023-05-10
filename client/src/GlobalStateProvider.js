import React, { useEffect, useState, createContext, useContext } from "react";
import API from "./api/API";

export const GlobalStateContext = createContext([{}, function () {}]);

const GlobalStateProvider = ({ children }) => {
  const [userID, setUserID] = useState("s313131");

  const [userInfo, setUserInfo] = useState({});

  // const [myCoursesNewQuestions, setMyCoursesNewQuestions] = useState([]);

  const [myBookmarkedQuestions, setMyBookmarkedQuestions] = useState([]);

  const [mySimulationResult, setMySimulationResult] = useState([]);

  const [relatedCourses, setRelatedCourses] = useState([]);

  const [allCourses, setAllCourses] = useState([]);

  const [userCourses, setUserCourses] = useState([]);

  useEffect(() => {
    API.getCourses().then((courses) => setAllCourses(courses));
    // API.getMyCourseNewQuestions(userID,20).then((questions) => {
    //   setMyCoursesNewQuestions(questions.map((x) => [x.questiontext.text]));
    // });
    API.getMyBookmarkedQuestions(userID).then((questions) => {
      setMyBookmarkedQuestions(questions["myBookmarkedQuestions"]);
    });
    API.getUser(userID).then((info) => {
      setUserInfo(info);
      setRelatedCourses(info["related_courses"]);
    });
    API.getMySimulationResult(userID).then((result) => {
      setMySimulationResult(result);
    });
  }, []);

  useEffect(() => {
    const Courses = allCourses?.filter((course) => {
      for (let i = 0; i < relatedCourses.length; i++) {
        if (course["_id"] === relatedCourses[i]) {
          return course;
        }
      }
    });
    setUserCourses(Courses);
  }, [allCourses, relatedCourses]);

  return (
    <GlobalStateContext.Provider
      value={{
        userInfo,
        setUserInfo,
        myBookmarkedQuestions,
        setMyBookmarkedQuestions,
        mySimulationResult,
        setMySimulationResult,
        userCourses,
        setUserCourses,
        allCourses,
        setAllCourses,
          userID
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
