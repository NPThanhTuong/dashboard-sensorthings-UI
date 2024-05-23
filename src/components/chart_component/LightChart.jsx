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
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

const LightChartPage = () => {
  const [allLight, setAllLight] = useState([]);
  const { token } = useAuth();
  useEffect(() => {
    const fetchAllLight = async () => {
      try {
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        const response = await axios.get(
          "/api/get/datastreams(6)/observations?top=all",
          {
            headers: {
              token: token,
            },
          },
        );

        setAllLight(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchAllLight();
  }, [token]);

  const data = {
    labels: allLight.map((obs) =>
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
        label: "Cường độ ánh sáng (lux)",
        data: allLight.map((obs) => obs.result[0]),
        backgroundColor: "rgba(238, 173, 14,0.5)",
        borderColor: "rgba(238, 173, 14,1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    type: "line",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Cường độ ánh sáng theo thời gian",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 100,
        },
      },
    },
  };

  return (
    <div className="h-full bg-white">
      {allLight.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default LightChartPage;
