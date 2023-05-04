import React, { useEffect, useState, createContext, useContext } from "react";
import API from "./api/API";

export const GlobalStateContext = createContext([{}, function () {}]);

const GlobalStateProvider = ({ children }) => {
  const [userID, setUserID] = useState("s313131");

  const [userInfo, setUserInfo] = useState({});

  const [myBookmarkedQuestions, setMyBookmarkedQuestions] = useState([]);

  const [mySimulationResult, setMySimulationResult] = useState([]);

  useEffect(() => {
    console.log("state provider user id", userID);
    API.getMyBookmarkedQuestions(userID).then((questions) => {
      setMyBookmarkedQuestions(questions["myBookmarkedQuestions"]);
    });
    API.getUser(userID).then((info) => {
      setUserInfo(info);
    });
    API.getMySimulationResult(userID).then((result) => {
      setMySimulationResult(result);
    });
  }, [userID]);

  return (
    <GlobalStateContext.Provider
      value={{
        userID,
        userInfo,
        setUserInfo,
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
