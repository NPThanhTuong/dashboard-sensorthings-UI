import { createContext, useState, useContext, useEffect } from "react";
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
  const [intervalTime, setIntervalTime] = useState(
    parseInt(Cookies.get("intervalTime")) || 5,
  ); // Thêm state cho thời gian gửi dữ liệu

  const saveToken = (token) => {
    Cookies.set("token", token, { expires: 7 });
    setToken(token);
  };

  const clearToken = () => {
    Cookies.remove("token");
    setToken("");
    setUser(null);
  };

  const updateIntervalTime = (value) => {
    Cookies.set("intervalTime", value, { expires: 7 });
    setIntervalTime(value);
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
        intervalTime,
        setIntervalTime: updateIntervalTime,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
