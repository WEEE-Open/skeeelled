import React, { useEffect, useState, createContext } from "react";
import API from "./api/API";

export const GlobalStateContext = createContext([{}, function () {}]);

const GlobalStateProvider = ({ children }) => {
  const [userID, setUserID] = useState("s288561");

  const [myCoursesNewQuestions, setMyCoursesNewQuestions] = useState([]);

  const [myBookmarkedQuestions, setMyBookmarkedQuestions] = useState([]);

  useEffect(() => {
    API.getMyCourseNewQuestions(userID).then((questions) => {
      setMyCoursesNewQuestions(questions.map((x) => [x.course]));
    });
    API.getMyBookmarkedQuestions(userID).then((questions) => {
      setMyBookmarkedQuestions(questions["myBookmarkedQuestions"]);
    });
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        myCoursesNewQuestions,
        setMyCoursesNewQuestions,
        myBookmarkedQuestions,
        setMyBookmarkedQuestions,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
