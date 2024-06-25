import React, { useContext } from "react";
import { Button } from "antd";
import { FiSun, FiMoon } from "react-icons/fi";
import ThemeContext from "../../context/ThemeContext";

const ThemeLightDark = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className={`flex items-center justify-center ${
        isDarkMode ? "bg-darkPrimary" : "bg-secondary text-headline"
      }`}
    >
      <div className="text-center">
        <Button
          type="primary"
          onClick={toggleTheme}
          className={`flex items-center justify-center rounded-full p-2 ${
            isDarkMode
              ? "bg-darkButton hover:bg-gray-700 dark:shadow-md dark:shadow-white"
              : "bg-primary hover:bg-green-600"
          }`}
          icon={
            isDarkMode ? (
              <FiSun className="text-white hover:text-black" />
            ) : (
              <FiMoon className="text-secondary hover:text-primary" />
            )
          }
          style={{ width: "40px", height: "40px" }}
        />
      </div>
    </div>
  );
};

export default ThemeLightDark;
