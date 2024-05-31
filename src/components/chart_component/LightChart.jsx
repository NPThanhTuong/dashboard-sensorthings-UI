import { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "../../context/AuthContext";
import LightTable from "../table_component/LightTable";
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

        setAllLight(sortedData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchAllLight();

    const interval = setInterval(() => {
      fetchAllLight();
    }, 3000); // Sau 3s sẽ fetch dữ liệu 1 lần

    return () => clearInterval(interval);
  }, [token]);

  const data = {
    labels: allLight?.map((obs) =>
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
      <LightTable/>
    </div>
  );
};

export default LightChartPage;
