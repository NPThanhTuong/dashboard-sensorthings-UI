import { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "../../context/AuthContext";

import { Line } from "react-chartjs-2";

import { formatTime, formatDate } from "../../utils/formatTime";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const SoilHumidityChartDay = () => {
  const [allSoilHumidity, setAllSoilHumidity] = useState([]);

  const { token } = useAuth();
  const today = new Date();
  const dateString = formatDate(today);

  useEffect(() => {
    const fetchAllSoilHumidity = async () => {
      try {
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        const response = await axios.get(
          "/api/get/datastreams(5)/observations?top=all",
          {
            headers: {
              token: token,
            },
          },
        );

        const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString(); // Thời gian bắt đầu của ngày
        const endOfDay = new Date(
          today.setHours(23, 59, 59, 999),
        ).toISOString(); // Thời gian kết thúc của ngày

        // Lọc dữ liệu để chỉ lấy các quan sát trong ngày hiện tại
        const filteredData = response.data.filter((obs) => {
          const obsTime = new Date(obs.resultTime).toISOString();
          return obsTime >= startOfDay && obsTime <= endOfDay;
        });

        // Sắp xếp dữ liệu theo thời gian tăng dần
        filteredData.sort(
          (a, b) => new Date(a.resultTime) - new Date(b.resultTime),
        );

        setAllSoilHumidity(filteredData);
        // console.log(response.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchAllSoilHumidity();

    const interval = setInterval(() => {
      fetchAllSoilHumidity();
    }, 900000); // Sau 15 phút sẽ fetch dữ liệu 1 lần

    return () => clearInterval(interval); // đảm bảo interval sẽ được dọn dẹp khi component unmount, ngăn ngừa việc gọi hàm fetch khi không cần thiết
  }, [token]);

  const data = {
    labels: allSoilHumidity.map((obs) => formatTime(new Date(obs.resultTime))),
    datasets: [
      {
        label: "Độ ẩm đất (%)",
        data: allSoilHumidity.map((obs) => obs.result[0]),
        backgroundColor: "rgba(128,0,0,1)",
        borderColor: "rgba(128,0,0, 2)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Độ ẩm đất theo thời gian - Ngày ${dateString}`,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} %`;
          },
        },
      },
    },
    scales: {
      //   x: {
      //     title: {
      //       display: true,
      //       text: "Thời gian",
      //     },
      //   },
      y: {
        title: {
          display: true,
          text: "Độ ẩm đất (%)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full">
      {allSoilHumidity.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p className="text-center">Đang tải...</p>
      )}
    </div>
  );
};

export default SoilHumidityChartDay;
