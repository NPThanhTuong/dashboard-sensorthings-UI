import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Light = () => {
  const [light, setLight] = useState(null);
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

        setLight(response.data[0].result[0]);
        // console.log(response.data);
      } catch (error) {
        setLight("Lỗi lấy dữ liệu:", error);
      }
    };

    fetchLight();

    const interval = setInterval(() => {
      fetchLight();
    }, 3000); // Sau 3s sẽ fetch dữ liệu 1 lần

    return () => clearInterval(interval); // đảm bảo interval sẽ được dọn dẹp khi component unmount, ngăn ngừa việc gọi hàm fetch khi không cần thiết
  }, [token]);

  return (
    <div className="flex w-full items-center border-4 border-yellow-300 px-4 py-3">
      <div className="text-xl">
        <span className="">Ánh sáng: </span>
        <span className="font-bold">
          {light !== null ? `${light} (lux)` : "Đang tải..."}
        </span>
      </div>
    </div>
  );
};

export default Light;
