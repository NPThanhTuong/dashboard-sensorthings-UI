import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

        const now = new Date();
        const threeDaysAgo = new Date(now);
        threeDaysAgo.setDate(now.getDate() - 1);

        const filteredData = response.data.filter((obs) => {
          const obsDate = new Date(obs.resultTime);
          return obsDate >= threeDaysAgo;
        });

        // Xắp sếp ngày tăng dần
        const sortedData = filteredData.sort(
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
    }, 3000);

    return () => clearInterval(interval);
  }, [token]);

  const data = {
    labels: allSoilHumidity?.map((obs) =>
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
        backgroundColor: "rgba(128, 0, 0, 1)",
        borderColor: "rgba(128, 0, 0, 1)",
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
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} %`;
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
        <Line data={data} options={options} />
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default SoilHumidityChart;
