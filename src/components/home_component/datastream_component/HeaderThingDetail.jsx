import React, { useState } from "react";
import { Alert, Layout, Typography } from "antd";
import { useTheme } from "@/context/ThemeContext";
import { FiMapPin } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

const { Title } = Typography;

const HeaderThingDetail = ({ thingName }) => {
  const { language } = useLanguage();
  const translations = useTranslations(language);

  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  if (error) {
    return (
      <div className="text-center">
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!thingName || !translations) {
    return null;
  }

  return (
    <Layout
      className={` ${isDarkMode ? "dark:bg-darkSecondary dark:text-white" : "bg-gray-300"}`}
    >
      <div className="flex items-start justify-between sm:flex-row sm:items-center">
        <Title
          level={3}
          className="text-4xl font-bold dark:text-white sm:text-3xl"
          style={{ fontFamily: "Roboto" }}
        >
          {thingName}
        </Title>
      </div>
      <div className="flex items-start justify-between sm:mt-0 sm:flex-row sm:items-center">
        <div className="flex items-center sm:mb-0 sm:w-2/3">
          <FiMapPin className="text-xl text-red-600" />
          <span className="pl-2 text-base">
            {translations["1 Đ. Lý Tự Trọng, An Phú, Ninh Kiều, Cần Thơ"]}
          </span>
        </div>
      </div>
    </Layout>
  );
};

export default HeaderThingDetail;
