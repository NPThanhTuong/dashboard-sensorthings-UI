import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Bar } from "react-chartjs-2";
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

const SoilHumidityChart = () => {
  const [allSoilHumidity, setAllSoilHumidity] = useState([]);
  const { token } = useAuth();

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

        // Sắp xếp dữ liệu theo thời gian tăng dần
        const sortedData = response.data.sort(
          (a, b) => new Date(a.resultTime) - new Date(b.resultTime),
        );

        setAllSoilHumidity(sortedData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchAllSoilHumidity();

    const interval = setInterval(() => {
      fetchAllSoilHumidity();
    }, 3000); // Sau 3s sẽ fetch dữ liệu 1 lần

    return () => clearInterval(interval); // đảm bảo interval sẽ được dọn dẹp khi component unmount, ngăn ngừa việc gọi hàm fetch khi không cần thiết
  }, [token]);

  const data = {
    labels: allSoilHumidity.map((obs) =>
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
        text: "Độ ẩm đất theo thời gian",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} lux`;
          },
        },
      },
    },
    scales: {
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
    <div className="h-full bg-white">
      {allSoilHumidity.length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default SoilHumidityChart;
