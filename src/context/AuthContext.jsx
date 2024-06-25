import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Use React Router's useNavigate
import { request } from "@/utils/request";

const AuthContext = createContext();

const fetchUser = async (token, setUser, clearToken, navigate) => {
  try {
    const response = await request.get("/user", {
      headers: {
        token: token,
      },
    });
    setUser(response.data);
  } catch (error) {
    console.error("Error fetching user info", error);
    if (error.response && error.response.status === 401) {
      clearToken();
      navigate("/dang-nhap");
    }
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [user, setUser] = useState(null);
  const [intervalTimes, setIntervalTimes] = useState(
    JSON.parse(Cookies.get("intervalTimes") || "{}"),
  );

  const saveToken = (token) => {
    const expires = 7;
    Cookies.set("token", token, { expires: expires });
    setToken(token);

    const expiresMs = expires * 24 * 60 * 60 * 1000;

    setTimeout(() => {
      clearToken();
      navigate("/dang-nhap");
    }, expiresMs);
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
      fetchUser(token, setUser, clearToken, navigate);
    }
  }, [token, navigate]);

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
