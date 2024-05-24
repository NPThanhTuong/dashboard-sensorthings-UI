import { useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "../../context/AuthContext";
import { Line } from "react-chartjs-2";
import { formatTime, formatDate } from "../../utils/formatTime";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho ChartJS
ChartJS.register(
  CategoryScale, // Đăng ký thành phần cho thang đo danh mục (trục x)
  LinearScale, // Đăng ký thành phần cho thang đo tuyến tính (trục y)
  PointElement, // Đăng ký thành phần cho các điểm trên biểu đồ
  LineElement, // Đăng ký thành phần cho các đường nối giữa các điểm
  Tooltip, // Đăng ký thành phần cho tooltip (chú giải khi di chuột qua điểm dữ liệu)
  Legend, // Đăng ký thành phần cho legend (chú giải màu sắc)
  Title, // Đăng ký thành phần cho tiêu đề biểu đồ
);

const LightChartDay = () => {
  const [allLight, setAllLight] = useState([]);
  const { token } = useAuth();
  const today = new Date();
  const dateString = formatDate(today);

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

        setAllLight(filteredData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchAllLight();

    const interval = setInterval(() => {
      fetchAllLight();
    }, 3000); // Sau 3s sẽ fetch dữ liệu 1 lần

    return () => clearInterval(interval); // đảm bảo interval sẽ được dọn dẹp khi component unmount, ngăn ngừa việc gọi hàm fetch khi không cần thiết
  }, [token]);

  // Tạo gradient cho nền
  const createGradient = (ctx, area) => {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    gradient.addColorStop(0, "rgba(238, 173, 14,0.5)");
    gradient.addColorStop(1, "rgba(238, 173, 14,1)");
    return gradient;
  };

  const data = {
    labels: allLight.map((obs) => formatTime(new Date(obs.resultTime))),
    datasets: [
      {
        label: "Cường độ ánh sáng (lux)",
        data: allLight.map((obs) => obs.result[0]),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }
          return createGradient(ctx, chartArea);
        },
        borderColor: "rgba(238, 173, 14,1)",
        borderWidth: 1,
        pointBackgroundColor: "rgba(238, 173, 14, 2)",
        pointBorderColor: "#fff",
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
        text: `Cường độ ánh sáng theo thời gian - Ngày ${dateString}`,
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
          text: "Cường độ ánh sáng (lux)",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 100,
        },
      },
    },
  };

  return (
    <div>
      {allLight.length > 0 ? (
        <Line data={data} options={options} />
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default LightChartDay;
