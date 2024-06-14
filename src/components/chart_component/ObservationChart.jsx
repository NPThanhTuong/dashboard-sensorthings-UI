import { useEffect, useState } from "react";
import axios, { all } from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Empty,
  DatePicker,
  notification,
  ConfigProvider,
  Skeleton,
  Tabs,
} from "antd";
import { twMerge } from "tailwind-merge";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);
import { useParams, useSearchParams } from "react-router-dom";
import { WarningOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import localizedFormat from "dayjs/plugin/localizedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import viVN from "antd/lib/locale/vi_VN";
import { useAuth } from "@/context/AuthContext";

const { RangePicker } = DatePicker;

dayjs.extend(localizedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.updateLocale("vi", {
  weekdaysShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  monthsShort: [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
  ],
});
dayjs.locale("vi");

const ObservationChart = ({ datastreamId, maxDaySort = 3 }) => {
  const [allObservations, setAllObservations] = useState([]);
  const [handleObservation, setHandleObservation] = useState([]);
  const [isErrorDatePicker, setIsErrorDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const { token } = useAuth();
  // const { datastreamId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const observationName = searchParams.get(`observationName_${datastreamId}`);

  useEffect(() => {
    const fetchAllObservations = async () => {
      setLoading(true);
      try {
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        const response = await axios.get(
          `/api/get/datastreams(${datastreamId})/observations?top=all`,
          {
            headers: {
              token: token,
            },
          },
        );

        let data = response.data;
        setLoading(false);
        data = data.sort(
          (a, b) => dayjs(a.result[0]["time"]) - dayjs(b.result[0]["time"]),
        );

        setAllObservations(data);
        setHandleObservation(data);
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

    const interval = setInterval(
      () => {
        fetchAllObservations();
      },
      1000 * 60 * 5,
    );

    return () => clearInterval(interval);
  }, [token, datastreamId]);

  const openNotification = (message, desc, icon) => {
    api.open({
      message: message,
      description: desc,
      icon: icon,
    });
  };
  const capitalizeFirstLetter = (string) => {
    if (!string) return string; // Kiểm tra chuỗi rỗng
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const lowerizeFirstLetter = (string) => {
    if (!string) return string; // Kiểm tra chuỗi rỗng
    return string.charAt(0).toLowerCase() + string.slice(1);
  };

  const handleChangeDate = (date, dateString) => {
    if (date) {
      const [startDate, endDate] = date;
      const diffHour = Math.abs(startDate.diff(endDate, "hour"));

      if (diffHour <= maxDaySort * 24) {
        // điều kiện số giờ lọc nhỏ hơn maxDaySort * 24 giờ
        setIsErrorDatePicker(false);
        const handleData = allObservations.filter(
          (item) =>
            dayjs(item.result[0]["time"]) >= startDate &&
            dayjs(item.result[0]["time"]) <= endDate,
        );
        console.log(handleData);
        setHandleObservation(handleData);
      } else {
        // số ngày lọc vượt quá 3 ngày
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
    for (const [key, value] of Object.entries(allObservations[0].result[0])) {
      if (key !== "time") {
        tabItems.push({ key: tabIndex, label: capitalizeFirstLetter(key) });
        tabIndex++;
      }
    }
  }

  const handleChangeTab = (key) => {
    const queryKey = `observationName_${datastreamId}`;
    const obj = {};
    obj[queryKey] = tabItems[key - 1]["label"];
    setSearchParams(obj);
  };

  const data = {
    labels: handleObservation.map((obs) =>
      new Date(obs.result[0]["time"]).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    ),
    datasets: [
      {
        label: capitalizeFirstLetter(observationName || tabItems[0]?.label),
        data: handleObservation.map(
          (obs) =>
            obs.result[0][
              lowerizeFirstLetter(observationName || tabItems[0]?.label)
            ],
        ),
        backgroundColor: "rgba(238, 173, 14, 0.5)",
        borderColor: "rgba(238, 173, 14, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Theo thời gian",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: capitalizeFirstLetter(observationName || tabItems[0]?.label),
        },
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <>
      {contextHolder}
      <ConfigProvider locale={viVN}>
        <div className="my-5 w-full rounded-md bg-secondary p-5 shadow-lg">
          <Tabs
            defaultActiveKey="1"
            items={tabItems}
            onChange={handleChangeTab}
          />
          <div className="flex justify-between">
            <h4 className="text-lg font-bold">Dữ liệu quan trắc</h4>
            <RangePicker
              showTime
              onChange={handleChangeDate}
              format="DD-MM-YYYY HH:mm:ss"
              status={isErrorDatePicker && "error"}
            />
          </div>

          <div className={twMerge("mt-6 flex flex-col justify-center")}>
            <div className="min-h-[60vh] w-full max-w-screen-2xl py-4">
              <Skeleton active loading={loading}>
                {handleObservation.length > 0 ? (
                  <div className="min-h-[60vh] rounded-lg bg-white p-6">
                    <Line data={data} options={options} />
                  </div>
                ) : (
                  <Empty description="Không có dữ liệu." />
                )}
              </Skeleton>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default ObservationChart;
