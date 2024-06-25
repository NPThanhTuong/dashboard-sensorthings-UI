import React, { useEffect, useState } from "react";
import { Card } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Import các hàm hỗ trợ từ observationConfig
import {
  getFieldIcon,
  borderClasses,
  resultClasses,
  backgroundClasses,
  darkBackgroundClasses,
} from "@/config/observationConfig.jsx";

// Sử dụng plugin customParseFormat của dayjs
dayjs.extend(customParseFormat);

// Import các context và hook cần thiết
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

// Component Observation để hiển thị các dữ liệu quan sát mới nhất
const Observation = ({ dataStreams, latestObservations }) => {
  const [loaded, setLoaded] = useState(false); // State để kiểm tra dữ liệu đã tải xong chưa
  const { isDarkMode } = useTheme(); // Lấy trạng thái dark mode từ context

  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại từ context
  const translations = useTranslations(language); // Lấy các bản dịch tương ứng với ngôn ngữ

  useEffect(() => {
    if (dataStreams && Object.keys(latestObservations).length > 0) {
      setLoaded(true); // Nếu có dữ liệu, đặt loaded thành true
    }
  }, [dataStreams, latestObservations]);

  // Hàm để viết hoa chữ cái đầu tiên của chuỗi
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Hàm lấy lớp CSS cho viền của field
  const getBorderClassName = (fieldName) => {
    return borderClasses[fieldName] || borderClasses.default;
  };

  // Hàm lấy lớp CSS cho nền của field
  const getBackgroundClassName = (fieldName) => {
    return isDarkMode
      ? darkBackgroundClasses[fieldName] || darkBackgroundClasses.default
      : backgroundClasses[fieldName] || backgroundClasses.default;
  };

  // Hàm lấy lớp CSS cho kết quả của field
  const getResultClassName = (fieldName) => {
    return resultClasses[fieldName] || resultClasses.default;
  };

  // Hàm làm sạch đơn vị của giá trị
  const cleanUnit = (value) => {
    return value.replace(/[()]/g, "").replace(/\s+/g, "").trim();
  };

  // Hàm định dạng thời gian
  const formatTime = (time) => {
    return dayjs(time).format("HH:mm:ss DD-MM-YYYY");
  };

  // Kiểm tra nếu không có dataStreams hoặc latestObservations thì trả về null
  if (
    !dataStreams ||
    dataStreams.length === 0 ||
    Object.keys(latestObservations).length === 0 ||
    !translations
  ) {
    return null;
  }

  return (
    <section className="my-4">
      <div
        className={`p-6 ${loaded ? "rounded-2xl" : ""} ${
          isDarkMode
            ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
            : "border-white bg-white"
        }`}
      >
        <h1
          className="-mt-4 mb-2 text-center text-xl font-bold"
          style={{
            fontFamily: "Roboto",
            visibility: loaded ? "visible" : "hidden", // Hiển thị tiêu đề khi dữ liệu đã tải xong
          }}
        >
          {translations["Dữ liệu"]}
        </h1>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          {dataStreams?.map((dataStream) => {
            const observations = latestObservations[dataStream.id];
            if (
              !observations ||
              !observations.result ||
              !observations.result[0]
            ) {
              return null; // Nếu không có dữ liệu quan sát, trả về null
            }

            return (
              <Card
                key={dataStream.id}
                className={`rounded-2xl border shadow-lg ${
                  isDarkMode
                    ? "dark:border-darkPrimary dark:bg-darkSecondary dark:text-white"
                    : "border-white bg-white"
                }`}
              >
                <div
                  className="-mt-4 mb-4 text-center text-lg font-bold"
                  style={{ fontFamily: "Roboto" }}
                >
                  {dataStream.name}
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {Object.entries(observations.result[0])?.map(
                    ([key, value], index) =>
                      key !== "time" && ( // Bỏ qua trường "time"
                        <Card
                          key={`${dataStream.id}-${key}-${index}`}
                          bordered={false}
                          className={`rounded-l-none rounded-r-2xl shadow-lg`}
                          style={{ background: getBackgroundClassName(key) }}
                        >
                          <div className="flex">
                            <div
                              className={`absolute bottom-0 left-0 top-0 flex w-[5%] items-center justify-center ${getBorderClassName(
                                key,
                              )}`}
                            ></div>
                            <div className="ml-2 flex-grow pl-1">
                              <div className="flex items-center justify-between gap-4">
                                <div>{getFieldIcon(key)}</div>
                                <div
                                  className={`text-2xl font-bold ${isDarkMode ? "text-white" : ""}`}
                                  style={{ fontFamily: "Kanit" }}
                                >
                                  {capitalizeFirstLetter(key)}
                                </div>
                              </div>
                              <div className="my-5 flex items-center justify-between">
                                <span
                                  className={`mx-auto text-4xl font-bold ${getResultClassName(
                                    key,
                                  )} ${isDarkMode ? "" : ""}`}
                                  style={{ fontFamily: "Kanit" }}
                                >
                                  {cleanUnit(value)}
                                </span>
                              </div>
                              <div className="mt-4 flex flex-col items-center justify-between">
                                <span
                                  className={`text-base ${isDarkMode ? "text-white" : ""}`}
                                  style={{ fontFamily: "Kanit" }}
                                >
                                  {translations["Thời gian cập nhật"]}
                                </span>
                                <span
                                  className={`text-xl font-medium ${isDarkMode ? "text-white" : ""}`}
                                  style={{ fontFamily: "Kanit" }}
                                >
                                  {formatTime(observations.result[0].time)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ),
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Observation;
