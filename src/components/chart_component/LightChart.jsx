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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

import { formatDate } from "../../utils/formatTime";

const LightChartPage = () => {
  const [allLight, setAllLight] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
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
        const maxEndDate = endDate ? new Date(endDate) : now;
        const maxStartDate = startDate
          ? new Date(startDate)
          : new Date(maxEndDate);

        if (!startDate) {
          maxStartDate.setDate(maxEndDate.getDate() - 3);
        }

        maxStartDate.setHours(0, 0, 0, 0);
        maxEndDate.setHours(23, 59, 59, 999);

        const filteredData = response.data.filter((obs) => {
          const obsDate = new Date(obs.resultTime);
          return obsDate >= maxStartDate && obsDate <= maxEndDate;
        });

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
    }, 900000);

    return () => clearInterval(interval);
  }, [token, startDate, endDate]);

  const handleStartDateChange = (e) => {
    const selectedStartDate = new Date(e.target.value);
    const currentEndDate = endDate ? new Date(endDate) : new Date();
    const diffTime = Math.abs(currentEndDate - selectedStartDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 3) {
      setError("Chỉ lọc trong khoảng thời gian 3 ngày!!!");
    } else {
      setError("");
      setStartDate(e.target.value);
    }
  };

  const handleEndDateChange = (e) => {
    const selectedEndDate = new Date(e.target.value);
    const currentStartDate = startDate ? new Date(startDate) : new Date();
    const diffTime = Math.abs(selectedEndDate - currentStartDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (selectedEndDate > new Date()) {
      setError("Ngày kết thúc không được vượt quá ngày hiện tại!!!");
    } else if (diffDays > 3) {
      setError("Chỉ lọc trong khoảng thời gian 3 ngày!!!");
    } else {
      setError("");
      setEndDate(e.target.value);
    }
  };

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
        text: "Cường độ ánh sáng theo thời gian",
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Cường độ ánh sáng (lux)",
        },
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="mb-4 flex w-full max-w-screen-2xl justify-end gap-8 rounded-lg bg-white p-4 shadow">
        <div className="flex flex-col">
          <label
            htmlFor="startDate"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            Ngày bắt đầu:
          </label>
          <input
            type="date"
            id="startDate"
            className="w-52 rounded border border-gray-300 px-2 py-1"
            value={startDate}
            onChange={handleStartDateChange}
            max={endDate || formatDate(new Date())}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="endDate"
            className="mb-2 text-sm font-medium text-gray-700"
          >
            Ngày kết thúc:
          </label>
          <input
            type="date"
            id="endDate"
            className="w-52 rounded border border-gray-300 px-2 py-1"
            value={endDate}
            onChange={handleEndDateChange}
            max={formatDate(new Date())}
            min={startDate}
          />
        </div>
      </div>
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="min-h-[60vh] w-full max-w-screen-2xl py-4">
        {allLight.length > 0 ? (
          <div className="min-h-[60vh] rounded-lg bg-white p-6 shadow">
            <Line data={data} options={options} />
          </div>
        ) : (
          <p className="text-center">Đang tải...</p>
        )}
      </div>
    </div>
  );
};

export default LightChartPage;
