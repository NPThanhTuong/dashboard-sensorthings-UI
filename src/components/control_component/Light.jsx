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
  }, []);

  return (
    <div className="flex w-full items-center justify-center border-4 border-yellow-300">
      <div className="text-center text-xl font-bold">
        <p className="">Ánh sáng</p>
        <p className="">{light !== null ? `${light} (lux)` : "Đang tải..."}</p>
      </div>
    </div>
  );
};

export default Light;
