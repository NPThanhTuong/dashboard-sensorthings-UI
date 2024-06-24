import { useEffect, useState } from "react";
import { notification, ConfigProvider } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/lib/locale/vi_VN";
import { useAuth } from "@/context/AuthContext";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchObservationsChart } from "@/apis/ObservationAPI";
import ObservationChartContent from "./ObservationChartContent";
import ObservationChartHeader from "./ObservationChartHeader";

dayjs.locale("vi");

import { useTheme } from "@/context/ThemeContext";

const ObservationChart = ({ datastreamId, maxDaySort = 3 }) => {
  const { isDarkMode } = useTheme();

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

  useEffect(() => {
    const fetchAllObservations = async () => {
      setLoading(true);
      try {
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        const data = await fetchObservationsChart(datastreamId, token);
        // Sort data by time in descending order
        const sortedData = data.sort(
          (a, b) =>
            dayjs(b.result[0]["time"]).valueOf() -
            dayjs(a.result[0]["time"]).valueOf(),
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
          const threeDaysAgo = dayjs().subtract(3, "days");
          const recentData = processedData.filter(
            (item) => dayjs(item.result[0]["time"]) >= threeDaysAgo,
          );
          // Sort recent data by time in descending order as well
          const sortedRecentData = recentData.sort(
            (a, b) =>
              dayjs(a.result[0]["time"]).valueOf() -
              dayjs(b.result[0]["time"]).valueOf(),
          );
          setHandleObservation(sortedRecentData);

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
  }, [token, datastreamId, intervalTimes, thingId, api]);

  const openNotification = (message, desc, icon) => {
    api.open({
      message: message,
      description: desc,
      icon: icon,
    });
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const lowerizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toLowerCase() + string.slice(1);
  };

  const handleChangeDate = (date, dateString) => {
    if (date) {
      const [startDate, endDate] = date;
      const diffHour = Math.abs(startDate.diff(endDate, "hour"));

      if (diffHour <= maxDaySort * 24) {
        setIsErrorDatePicker(false);
        const handleData = allObservations.filter(
          (item) =>
            dayjs(item.result[0]["time"]) >= startDate &&
            dayjs(item.result[0]["time"]) <= endDate,
        );
        // Sort handleData by time in descending order
        const sortedHandleData = handleData.sort(
          (a, b) => dayjs(a.result[0]["time"]) - dayjs(b.result[0]["time"]),
        );
        setHandleObservation(sortedHandleData);
      } else {
        setIsErrorDatePicker(true);
        setHandleObservation([]);
        openNotification(
          "Chọn ngày, giờ không hợp lệ!",
          `Vui lòng chọn ngày, giờ trong khoảng thời gian ${maxDaySort * 24} giờ`,
          <WarningOutlined style={{ color: "#faad14" }} />,
        );
      }
    } else {
      setIsErrorDatePicker(false);
      setHandleObservation(allObservations);
    }
  };

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

  const handleChangeTab = (key) => {
    setActiveTabKey(key);
    const selectedTab = tabItems.find((tab) => tab.key === key);
    const queryKey = `observationName_${datastreamId}`;
    const obj = {};
    obj[queryKey] = selectedTab.label;
    setSearchParams(obj);
    setObservationName(lowerizeFirstLetter(selectedTab.label));
  };

  return (
    <>
      {contextHolder}
      <ConfigProvider locale={viVN}>
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
