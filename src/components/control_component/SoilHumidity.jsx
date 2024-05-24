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

    const interval = setInterval(() => {
      fetchSoilHumidity();
    }, 3000); // Sau 3s sẽ fetch dữ liệu 1 lần

    return () => clearInterval(interval); // đảm bảo interval sẽ được dọn dẹp khi component unmount, ngăn ngừa việc gọi hàm fetch khi không cần thiết
  }, [token]);

  return (
    <div className="flex w-full items-center border-4 border-red-800 px-4 py-3">
      <div className="text-xl">
        <span>Độ ẩm đất: </span>
        <span className="font-bold">
          {soilHumidity !== null ? `${soilHumidity} (%)` : "Đang tải..."}
        </span>
      </div>
    </div>
  );
};

export default SoilHumidity;
