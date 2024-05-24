import { createContext, useState, useContext } from "react";
//import axios from "axios";
import Cookies from "js-cookie";

const AuthContext = createContext();

// const fetchUser = async (token, setUser) => {
//   try {
//     const response = await axios.get("/api/user", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     setUser(response.data);
//   } catch (error) {
//     console.error("Lỗi lấy thông tin user", error);
//   }
// };

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token") || "");
  const [user, setUser] = useState(null);

  const saveToken = (token) => {
    Cookies.set("token", token, { expires: 7 });
    setToken(token);
  };

  const clearToken = () => {
    Cookies.remove("token");
    setToken("");
    setUser(null);
  };

  //   useEffect(() => {
  //     if (token) {
  //       fetchUser(token, setUser);
  //     }
  //   }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, saveToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
