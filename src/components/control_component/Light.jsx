import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

import { TiAdjustBrightness } from "react-icons/ti";

const Light = () => {
  const [light, setLight] = useState(null); // Khởi tạo state để lưu cường độ ánh sáng
  const { token } = useAuth();

  useEffect(() => {
    const fetchLight = async () => {
      try {
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        const response = await axios.get(
          "/api/get/datastreams(6)/observations",
          {
            headers: {
              token: token,
            },
          },
        );

        const lightValue = response.data[0].result[0];
        setLight(lightValue);
      } catch (error) {
        setLight("Lỗi lấy dữ liệu");
      }
    };

    fetchLight();

    const interval = setInterval(() => {
      fetchLight();
    }, 3000);

    return () => clearInterval(interval);
  }, [token]);

  const radius = 60; // Bán kính của vòng tròn
  const diameter = radius * 2; // Đường kính của vòng tròn
  const circumference = 2 * Math.PI * radius; // Chu vi của vòng tròn
  const progress =
    light !== null
      ? (circumference * (100 - (light / 1000) * 100)) / 100 // Tính phần còn lại chưa được tô màu dựa trên cường độ ánh sáng
      : circumference;

  return (
    <div className="mx-auto min-w-72 rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-yellow-500">Ánh sáng</h2>
        <TiAdjustBrightness className="text-3xl text-yellow-500" />
      </div>
      <div className="relative mb-4">
        <svg
          className="mx-auto"
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter + 16} ${diameter + 16}`}
        >
          <defs>
            <linearGradient
              id="yellow-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#FFD700", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#FFA500", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <circle
            className="text-gray-300"
            strokeWidth="12" // Tăng độ dày của vòng tròn
            stroke="gray"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          <circle
            className="text-yellow-500"
            strokeWidth="12" // Tăng độ dày của vòng tròn
            stroke="url(#yellow-gradient)" // Sử dụng màu gradient
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: progress,
              transition: "stroke-dashoffset 0.5s ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-2xl font-bold">
            {light !== null ? `${light} lux` : "Đang tải..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Light;
