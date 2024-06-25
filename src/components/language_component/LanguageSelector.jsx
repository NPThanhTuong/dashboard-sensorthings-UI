import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

import { useTheme } from "@/context/ThemeContext";

const LanguageSelector = () => {
  const { changeLanguage, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getLanguageLabel = (lang) => {
    switch (lang) {
      case "en":
        return "EN";
      case "vi":
        return "VI";
      default:
        return "Language";
    }
  };

  return (
    <div
      className={`relative inline-block text-left ${
        isDarkMode
          ? " dark:bg-darkPrimary dark:text-white"
          : "border-primary bg-white"
      }`}
    >
      <div
        className="dark:bg-darkButton flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary p-2 text-white dark:rounded-full dark:shadow-md dark:shadow-white dark:hover:bg-blue-500"
        onClick={toggleDropdown}
      >
        <span className="">{getLanguageLabel(language)}</span>
      </div>
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-32 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5  dark:bg-darkPrimary dark:text-white">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              className="w-full px-4 py-2 text-sm"
              onClick={() => handleLanguageChange("en")}
            >
              English
            </button>
            <button
              className="w-full px-4 py-2 text-sm"
              onClick={() => handleLanguageChange("vi")}
            >
              Tiếng Việt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
