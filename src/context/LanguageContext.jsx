import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Lấy ngôn ngữ từ cookies, nếu không có thì mặc định là "vi"
  const initialLanguage = Cookies.get("language") || "vi";
  const [language, setLanguage] = useState(initialLanguage);

  // Hàm để thay đổi ngôn ngữ
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Lưu ngôn ngữ vào cookies mỗi khi ngôn ngữ thay đổi
  useEffect(() => {
    Cookies.set("language", language, { expires: 365 });
  }, [language]);

  const value = {
    language,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
