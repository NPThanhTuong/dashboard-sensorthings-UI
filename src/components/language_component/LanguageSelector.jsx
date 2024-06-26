import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

import enFlag from "@public/images/icons/English.png";
import viFlag from "@public/images/icons/VN.png";

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

  const getLanguageFlag = (lang) => {
    switch (lang) {
      case "en":
        return <img src={enFlag} alt="Flag English" className="w-5" />;
      case "vi":
        return <img src={viFlag} alt="Flag VietNam" className="w-5" />;
      default:
        return "🌐";
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
        className="flex h-10  w-10 cursor-pointer items-center justify-center rounded-full bg-primary p-2 text-white dark:rounded-full dark:bg-darkButton dark:shadow-md dark:shadow-white dark:hover:bg-blue-500"
        onClick={toggleDropdown}
      >
        <span className="">
          {/* {getLanguageFlag(language)} */}
          {getLanguageLabel(language)}
        </span>
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
              className="flex w-full items-center px-4 py-2 text-sm"
              onClick={() => handleLanguageChange("en")}
            >
              <span role="img" aria-label="English" className="mr-2">
                <img src={enFlag} alt="Flag English" className="w-5" />
              </span>
              English
            </button>
            <button
              className="flex w-full items-center px-4 py-2 text-sm"
              onClick={() => handleLanguageChange("vi")}
            >
              <span role="img" aria-label="Vietnamese" className="mr-2">
                <img src={viFlag} alt="Flag VietNam" className="w-5" />
              </span>
              Việt Nam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
