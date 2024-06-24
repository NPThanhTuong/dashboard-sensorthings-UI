import React from "react";
import { Tabs, DatePicker } from "antd";
import { useTheme } from "@/context/ThemeContext";
import "@public/styles/calendar.css";

const { RangePicker } = DatePicker;

import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

const ObservationChartHeader = ({
  activeTabKey,
  tabItems,
  handleChangeTab,
  handleChangeDate,
  isErrorDatePicker,
}) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);

  if (!translations) {
    return null;
  }
  return (
    <>
      <Tabs
        activeKey={activeTabKey}
        items={tabItems}
        onChange={handleChangeTab}
      />
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold">
          {translations["Dữ liệu quan trắc"]}
        </h4>
        <RangePicker
          showTime
          onChange={handleChangeDate}
          format="DD-MM-YYYY HH:mm:ss"
          status={isErrorDatePicker ? "error" : ""}
          className={`w-full max-w-xs ${
            isDarkMode
              ? "dark-placeholder dark:border-darkPrimary dark:bg-darkSecondary dark:text-white dark:shadow-md dark:shadow-white"
              : ""
          }`}
          getPopupContainer={(trigger) => trigger.parentElement}
          dropdownClassName={isDarkMode ? "dark-theme-datepicker" : ""}
        />
      </div>
    </>
  );
};

export default ObservationChartHeader;
