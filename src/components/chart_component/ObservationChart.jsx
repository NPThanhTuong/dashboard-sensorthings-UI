import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
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
import { Empty } from "antd";
import { twMerge } from "tailwind-merge";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);
import dayjs from "dayjs";

const ObservationChart = ({
  datastreamId,
  pickedDate: [startDate, endDate],
  chartLabel,
  chartBgColor,
  chartBorderColor,
  chartTitle,
  chartColunmYTitle,
  className,
  maxSortDay,
  isGetAll = false,
  isError = false,
}) => {
  const [allObservations, setAllObservations] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAllObservations = async () => {
      try {
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        if (isError) {
          setAllObservations([]);
        } else {
          const response = await axios.get(
            `/api/get/datastreams(${datastreamId})/observations?top=all`,
            {
              headers: {
                token: token,
              },
            },
          );

          let filteredData = response.data;

          if (!isGetAll) {
            filteredData = response.data.filter((obs) => {
              const obsDate = dayjs(obs.resultTime);
              return obsDate >= startDate && obsDate <= endDate;
            });
          }

          const sortedData = filteredData.sort(
            (a, b) => dayjs(a.resultTime) - dayjs(b.resultTime),
          );

          setAllObservations(sortedData);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchAllObservations();

    const interval = setInterval(() => {
      fetchAllObservations();
    }, 900000);

    return () => clearInterval(interval);
  }, [token, startDate, endDate, datastreamId, isGetAll]);

  const data = {
    labels: allObservations.map((obs) =>
      new Date(obs.resultTime).toLocaleString("vi-VN", {
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
        label: chartLabel,
        data: allObservations.map((obs) => obs.result[0]),
        backgroundColor: chartBgColor,
        borderColor: chartBorderColor,
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
        text: chartTitle,
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: chartColunmYTitle,
        },
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className={twMerge("flex flex-col justify-center", className)}>
      <div className="min-h-[60vh] w-full max-w-screen-2xl py-4">
        {allObservations.length > 0 ? (
          <div className="min-h-[60vh] rounded-lg bg-white p-6 shadow">
            <Line data={data} options={options} />
          </div>
        ) : (
          <Empty description="Không có dữ liệu." />
        )}
      </div>
    </div>
  );
};

export default ObservationChart;
