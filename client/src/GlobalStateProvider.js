import React, { useEffect, useState, createContext, useContext } from "react";
import API from "./api/API";

export const GlobalStateContext = createContext([{}, function () {}]);

const GlobalStateProvider = ({ children }) => {
  const [userID, setUserID] = useState("s288561");

  const [userInfo, setUserInfo] = useState({});

  const [myCoursesNewQuestions, setMyCoursesNewQuestions] = useState([]);

  const [myBookmarkedQuestions, setMyBookmarkedQuestions] = useState([]);

  const [mySimulationResult, setMySimulationResult] = useState([]);

  useEffect(() => {
    API.getMyCourseNewQuestions(userID).then((questions) => {
      setMyCoursesNewQuestions(questions.map((x) => [x.course]));
    });
    API.getMyBookmarkedQuestions(userID).then((questions) => {
      setMyBookmarkedQuestions(questions["myBookmarkedQuestions"]);
    });
    API.getUser(userID).then((info) => {
      setUserInfo(info);
    });
    API.getMySimulationResult(userID).then((result) => {
      setMySimulationResult(result);
    });
  }, []);

  console.log(userInfo);

  return (
    <GlobalStateContext.Provider
      value={{
        userInfo,
        setUserInfo,
        myCoursesNewQuestions,
        setMyCoursesNewQuestions,
        myBookmarkedQuestions,
        setMyBookmarkedQuestions,
        mySimulationResult,
        setMySimulationResult,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
