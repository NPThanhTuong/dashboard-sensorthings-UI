import { useEffect, useState } from "react";
import { notification, ConfigProvider, Tabs } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import viVN from "antd/lib/locale/vi_VN";
import { useAuth } from "@/context/AuthContext";
import { useParams, useSearchParams } from "react-router-dom";
import { fetchObservations } from "@/apis/ObservationAPI";
import * as XLSX from "xlsx";
import ObservationTableContent from "./ObservationTableContent";
import ObservationTableHeader from "./ObservationTableHeader";

import { useTheme } from "@/context/ThemeContext";

const ObservationTable = ({ datastreamId, maxDaySort = 3 }) => {
  const { isDarkMode } = useTheme();

  const { thingId } = useParams();
  const { token, intervalTimes } = useAuth();
  const [state, setState] = useState({
    allObservations: [],
    handleObservation: [],
    isErrorDatePicker: false,
    loading: true,
    activeTabKey: "1",
    observationName: "",
  });
  const {
    allObservations,
    handleObservation,
    isErrorDatePicker,
    loading,
    activeTabKey,
    observationName,
  } = state;
  const [api, contextHolder] = notification.useNotification();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchAllObservations = async () => {
      try {
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        const data = await fetchObservations(datastreamId, token);
        const sortedData = data.sort(
          (a, b) => dayjs(b.result[0]["time"]) - dayjs(a.result[0]["time"]),
        );

        const processedData = sortedData.map((observation) => {
          const result = observation.result[0];
          const processedResult = {};
          for (const key in result) {
            if (result?.hasOwnProperty(key)) {
              if (key === "time") {
                processedResult[key] = dayjs(result[key]);
              } else {
                const valueWithUnit = result[key].split(" ");
                processedResult[key] = {
                  value: parseFloat(valueWithUnit[0]),
                  unit: valueWithUnit[1] || "",
                };
              }
            }
          }
          return { ...observation, result: [processedResult] };
        });

        if (JSON.stringify(processedData) !== JSON.stringify(allObservations)) {
          setState((prevState) => ({
            ...prevState,
            allObservations: processedData,
            handleObservation: processedData,
            loading: false,
          }));

          setState((prevState) => ({
            ...prevState,
            observationName: Object.keys(processedData[0].result[0]).find(
              (key) => key !== "time",
            ),
          }));
        }
      } catch (error) {
        api.open({
          message: "Lỗi dữ liệu!",
          description: `Xảy ra lỗi khi lấy dữ liệu từ máy chủ.`,
          icon: <WarningOutlined style={{ color: "#faad14" }} />,
        });
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchAllObservations();
    const intervalTime = intervalTimes[thingId] || 5;
    const interval = setInterval(
      fetchAllObservations,
      intervalTime * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [token, datastreamId, intervalTimes, thingId, allObservations, api]);

  const openNotification = (message, desc, icon) => {
    api.open({
      message: message,
      description: desc,
      icon: icon,
    });
  };

  const handleChangeDate = (date) => {
    if (date) {
      const [startDate, endDate] = date;
      const diffHour = Math.abs(startDate.diff(endDate, "hour"));
      if (diffHour <= maxDaySort * 24) {
        setState((prevState) => ({ ...prevState, isErrorDatePicker: false }));
        const handleData = allObservations.filter(
          (item) =>
            dayjs(item.result[0]["time"]) >= startDate &&
            dayjs(item.result[0]["time"]) <= endDate,
        );
        setState((prevState) => ({
          ...prevState,
          handleObservation: handleData,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          isErrorDatePicker: true,
          handleObservation: [],
        }));
        openNotification(
          "Chọn ngày, giờ không hợp lệ!",
          `Vui lòng chọn ngày, giờ trong khoảng thời gian ${maxDaySort * 24} giờ`,
          <WarningOutlined style={{ color: "#faad14" }} />,
        );
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        isErrorDatePicker: false,
        handleObservation: allObservations,
      }));
    }
  };

  const capitalizeFirstLetter = (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : string;
  const lowerizeFirstLetter = (string) =>
    string ? string.charAt(0).toLowerCase() + string.slice(1) : string;

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
    setState((prevState) => ({ ...prevState, activeTabKey: key }));
    const selectedTab = tabItems.find((tab) => tab.key === key);
    const queryKey = `observationName_${datastreamId}`;
    setSearchParams({ [queryKey]: selectedTab.label });
    setState((prevState) => ({
      ...prevState,
      observationName: lowerizeFirstLetter(selectedTab.label),
    }));
  };

  const exportToExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const fileName = "observation_data";

    try {
      const formattedData = handleObservation.map((obs, index) => ({
        STT: index + 1,
        Thời_gian: obs.result[0]["time"].toString(), // Lưu thời gian dưới dạng chuỗi
        [capitalizeFirstLetter(observationName)]: observationName
          ? `${obs?.result[0][lowerizeFirstLetter(observationName)]?.value} ${obs?.result[0][lowerizeFirstLetter(observationName)]?.unit}`
          : null,
      }));

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName + fileExtension;
      link.click();
    } catch (error) {
      console.error("Lỗi khi xuất Excel:", error);
    }
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
          <Tabs
            defaultActiveKey={activeTabKey}
            items={tabItems}
            onChange={handleChangeTab}
          />
          <ObservationTableHeader
            handleChangeDate={handleChangeDate}
            isErrorDatePicker={isErrorDatePicker}
            exportToExcel={exportToExcel}
          />
          <ObservationTableContent
            loading={loading}
            handleObservation={handleObservation}
            observationName={observationName}
            capitalizeFirstLetter={capitalizeFirstLetter}
            lowerizeFirstLetter={lowerizeFirstLetter}
          />
        </div>
      </ConfigProvider>
    </>
  );
};

export default ObservationTable;
