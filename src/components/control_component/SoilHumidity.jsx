import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const SoilHumidity = () => {
  const [soilHumidity, setSoilHumidity] = useState(null); // Khởi tạo state để lưu độ ẩm đất
  const { token } = useAuth();

  useEffect(() => {
    const fetchSoilHumidity = async () => {
      try {
        if (!token) {
          throw new Error("Token không tồn tại");
        }

        const response = await axios.get(
          "/api/get/datastreams(5)/observations",
          {
            headers: {
              token: token,
            },
          },
        );

        setSoilHumidity(response.data[0].result[0]);
      } catch (error) {
        setSoilHumidity("Lỗi lấy dữ liệu");
      }
    };

    fetchSoilHumidity();

    const interval = setInterval(() => {
      fetchSoilHumidity(); // Lấy dữ liệu mỗi 3 giây
    }, 3000);

    return () => clearInterval(interval); // Dọn dẹp khi component bị hủy
  }, [token]);

  const radius = 60; // Bán kính của vòng tròn
  const diameter = radius * 2; // Đường kính của vòng tròn
  const circumference = 2 * Math.PI * radius; // Chu vi của vòng tròn
  const progress =
    soilHumidity !== null
      ? (circumference * (100 - soilHumidity)) / 100 // Tính phần còn lại chưa được tô màu dựa trên độ ẩm đất
      : circumference;

  return (
    <div className="mx-auto min-w-72 rounded-lg bg-white p-4 shadow-md">
      <div className="mb-4 flex items-center justify-center">
        <h2 className="text-center text-xl font-bold">Thông tin độ ẩm đất</h2>
      </div>
      <div className="relative mb-4">
        <svg
          className="mx-auto"
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter + 16} ${diameter + 16}`}
        >
          <circle
            className="text-gray-300"
            strokeWidth="8"
            stroke="gray"
            fill="transparent"
            r={radius}
            cx="50%"
            cy="50%"
          />
          <circle
            className="text-brown-500"
            strokeWidth="8"
            stroke="brown"
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
            {soilHumidity !== null ? `${soilHumidity} %` : "Đang tải..."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilHumidity;
