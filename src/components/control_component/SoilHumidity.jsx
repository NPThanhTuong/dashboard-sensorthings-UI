import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const SoilHumidity = () => {
  const [soilHumidity, setSoilHumidity] = useState(null);
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
        // console.log(response.data);
      } catch (error) {
        setSoilHumidity("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchSoilHumidity();
  }, []);

  return (
    <div className="flex w-full items-center justify-center border-4 border-red-800">
      <div className="text-center text-xl font-bold">
        <p>Độ ẩm đất</p>
        <p>{soilHumidity !== null ? `${soilHumidity} (%)` : "Đang tải..."}</p>
      </div>
    </div>
  );
};

export default SoilHumidity;
