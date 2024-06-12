import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const AuthContext = createContext();

const fetchUser = async (token, setUser) => {
  try {
    const response = await axios.get("/api/user", {
      headers: {
        token: token,
      },
    });
    setUser(response.data);
  } catch (error) {
    console.error("Lỗi lấy thông tin user", error);
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [user, setUser] = useState(null);
  const [intervalTimes, setIntervalTimes] = useState(
    JSON.parse(Cookies.get("intervalTimes") || "{}"),
  ); // State for storing interval times for each thing

  const saveToken = (token) => {
    Cookies.set("token", token, { expires: 7 });
    setToken(token);
  };

  const clearToken = () => {
    Cookies.remove("token");
    setToken("");
    setUser(null);
  };

  const updateIntervalTime = (thingId, value) => {
    const newIntervalTimes = { ...intervalTimes, [thingId]: value };
    Cookies.set("intervalTimes", JSON.stringify(newIntervalTimes), {
      expires: 7,
    });
    setIntervalTimes(newIntervalTimes);
  };

  useEffect(() => {
    if (token) {
      fetchUser(token, setUser);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        saveToken,
        clearToken,
        intervalTimes,
        setIntervalTime: updateIntervalTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
