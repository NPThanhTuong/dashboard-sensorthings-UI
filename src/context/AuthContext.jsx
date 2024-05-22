import { createContext, useState, useContext } from "react";
//import axios from "axios";
import Cookies from "js-cookie";


const AuthContext = createContext();


//eslint-disable-next-line react/prop-types
export const AuthProvider = ( {children} ) => {
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