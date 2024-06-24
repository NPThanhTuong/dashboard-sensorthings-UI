import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(Cookies.get("theme") === "dark");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      Cookies.set("theme", "dark", { expires: 7 });
    } else {
      document.documentElement.classList.remove("dark");
      Cookies.set("theme", "light", { expires: 7 });
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
