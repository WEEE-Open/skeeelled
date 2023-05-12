import React, { useEffect, useState, createContext } from "react";
import API from "./api/API";

export const GlobalStateContext = createContext([{}, function () {}]);

const GlobalStateProvider = ({ children }) => {
  const [userID, setUserID] = useState("s313131");

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    console.log("state provider user id", userID);
    API.getUser(userID).then((info) => {
      setUserInfo(info);
    });
  }, [userID]);

  return (
    <GlobalStateContext.Provider
      value={{
        userID,
        userInfo,
        setUserInfo,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;
