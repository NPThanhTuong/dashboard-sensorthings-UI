import { useEffect, useState } from "react";
import { notification, ConfigProvider } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/lib/locale/vi_VN";
import enUS from "antd/lib/locale/en_US";
import { useAuth } from "@/context/AuthContext";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchObservationsChart } from "@/apis/ObservationAPI";
import ObservationChartContent from "./ObservationChartContent";
import ObservationChartHeader from "./ObservationChartHeader";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";
import { useTheme } from "@/context/ThemeContext";

dayjs.locale("vi");

const ObservationChart = ({ datastreamId, maxDaySort = 3 }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);

  const { thingId } = useParams();
  const [allObservations, setAllObservations] = useState([]);
  const [handleObservation, setHandleObservation] = useState([]);
  const [isErrorDatePicker, setIsErrorDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const { token, intervalTimes } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [observationName, setObservationName] = useState("");
  const [units, setUnits] = useState({});
  const [activeTabKey, setActiveTabKey] = useState("1");

  // Dark mode notification styles
  const darkModeNotificationStyle = {
    background: "#333",
    color: "#fff",
    border: "1px solid #444",
  };

  // Function to get locale based on current language
  const getLocale = (language) => {
    switch (language) {
      case "vi":
        dayjs.locale("vi");
        return viVN;
      case "en":
      default:
        dayjs.locale("en");
        return enUS;
    }
  };

  // useEffect để lấy tất cả các quan sát khi component được render
  useEffect(() => {
    const fetchAllObservations = async () => {
      setLoading(true);
      try {
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        const data = await fetchObservationsChart(datastreamId, token);
        // Lọc ra các quan sát không có thời gian hợp lệ
        const filteredData = data.filter(
          (observation) =>
            observation.result &&
            observation.result[0] &&
            observation.result[0].time,
        );

        // Sắp xếp dữ liệu theo thời gian tăng dần
        const sortedData = filteredData.sort(
          (a, b) =>
            dayjs(a.result[0]["time"]).valueOf() -
            dayjs(b.result[0]["time"]).valueOf(),
        );

        const processedData = sortedData.map((observation) => {
          const result = observation.result[0];
          const processedResult = {};
          const tempUnits = {};

          for (const key in result) {
            if (result?.hasOwnProperty(key)) {
              if (key === "time") {
                processedResult[key] = dayjs(result[key]);
              } else {
                const [value, unit] = result[key].split(" ");
                processedResult[key] = value ? parseFloat(value) : null;
                tempUnits[key] = unit;
              }
            }
          }

          setUnits((prevUnits) => ({ ...prevUnits, ...tempUnits }));

          return {
            ...observation,
            result: [processedResult],
          };
        });

        if (JSON.stringify(processedData) !== JSON.stringify(allObservations)) {
          setAllObservations(processedData);
          setHandleObservation(processedData);

          const initialObservationName = Object.keys(
            processedData[0].result[0],
          ).find((key) => key !== "time");
          setObservationName(initialObservationName);
        }
        setLoading(false);
      } catch (error) {
        api.open({
          message: "Lỗi dữ liệu!",
          description: `Xảy ra lỗi khi lấy dữ liệu từ máy chủ.`,
          icon: <WarningOutlined style={{ color: "#faad14" }} />,
          style: isDarkMode ? darkModeNotificationStyle : {},
        });
        console.error("Lỗi lấy dữ liệu:", error);
        setLoading(false);
      }
    };

    fetchAllObservations();
    const intervalTime = intervalTimes[thingId] || 5;
    const interval = setInterval(
      fetchAllObservations,
      intervalTime * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [token, datastreamId, intervalTimes, thingId, api, isDarkMode]);

  // Hàm mở thông báo
  const openNotification = (message, desc, icon) => {
    api.open({
      message: message,
      description: desc,
      icon: icon,
      style: isDarkMode ? darkModeNotificationStyle : {},
    });
  };

  // Hàm viết hoa chữ cái đầu tiên của chuỗi
  const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Hàm viết thường chữ cái đầu tiên của chuỗi
  const lowerizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toLowerCase() + string.slice(1);
  };

  // Hàm xử lý thay đổi ngày
  const handleChangeDate = (date, dateString) => {
    if (date) {
      const [startDate, endDate] = date;
      const diffHour = Math.abs(startDate.diff(endDate, "hour"));

      if (diffHour <= maxDaySort * 24) {
        setIsErrorDatePicker(false); // Không có lỗi
        const handleData = allObservations.filter(
          (item) =>
            dayjs(item.result[0]["time"]) >= startDate &&
            dayjs(item.result[0]["time"]) <= endDate,
        );
        // Sắp xếp handleData theo thời gian tăng dần
        const sortedHandleData = handleData.sort(
          (a, b) => dayjs(a.result[0]["time"]) - dayjs(b.result[0]["time"]),
        );
        setHandleObservation(sortedHandleData);
      } else {
        setIsErrorDatePicker(true); // Có lỗi
        setHandleObservation([]);
        openNotification(
          translations["Chọn ngày, giờ không hợp lệ!"],
          `${translations["Vui lòng chọn ngày, giờ trong khoảng thời gian"]} ${
            maxDaySort * 24
          } ${translations["giờ"]}`,
          <WarningOutlined style={{ color: "#faad14" }} />,
        );
      }
    } else {
      setIsErrorDatePicker(false); // Không có lỗi
      setHandleObservation(allObservations);
    }
  };

  // Tạo các tab từ dữ liệu quan sát
  let tabItems = [];
  if (allObservations.length > 0) {
    let tabIndex = 1;
    for (const key in allObservations[0].result[0]) {
      if (key !== "time") {
        tabItems.push({
          key: tabIndex.toString(),
          label: capitalizeFirstLetter(key),
        });
        tabIndex++;
      }
    }
  }

  // Hàm xử lý thay đổi tab
  const handleChangeTab = (key) => {
    setActiveTabKey(key);
    const selectedTab = tabItems.find((tab) => tab.key === key);
    const queryKey = `observationName_${datastreamId}`;
    const obj = {};
    obj[queryKey] = selectedTab.label;
    setSearchParams(obj);
    setObservationName(lowerizeFirstLetter(selectedTab.label));
  };

  if (!translations) {
    return null;
  }

  return (
    <>
      {contextHolder}
      <ConfigProvider locale={getLocale(language)}>
        <div
          className={`w-full rounded-2xl p-5 shadow-lg ${
            isDarkMode
              ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
              : "border-white bg-white"
          }`}
        >
          <ObservationChartHeader
            activeTabKey={activeTabKey}
            tabItems={tabItems}
            handleChangeTab={handleChangeTab}
            handleChangeDate={handleChangeDate}
            isErrorDatePicker={isErrorDatePicker}
          />
          <ObservationChartContent
            handleObservation={handleObservation}
            allObservations={allObservations}
            observationName={observationName}
            tabItems={tabItems}
            units={units}
          />
        </div>
      </ConfigProvider>
    </>
  );
};

export default ObservationChart;
