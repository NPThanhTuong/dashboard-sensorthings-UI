import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import Sensor from "@public/images/sensor.png";

const ListSensor = () => {
  const { token } = useAuth();
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng mục trên mỗi trang
  const navigate = useNavigate();

  const fetchSensors = async () => {
    try {
      const response = await axios.get("/api/get/sensors?top=all", {
        headers: {
          token: token,
        },
      });
      if (Array.isArray(response.data)) {
        setSensors(response.data);
      } else {
        setSensors([]);
        console.error(
          "API response is not in the expected format or success is false",
        );
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors(); // Lấy danh sách Sensors ban đầu

    const interval = setInterval(() => {
      fetchSensors(); // Lấy danh sách Sensors định kỳ
    }, 3000); // Sau 3 giây lấy dữ liệu mới

    return () => clearInterval(interval);
  }, [token]);

  // Tính số lượng trang
  const totalPages = Math.ceil(sensors.length / itemsPerPage);

  // Lấy chỉ số của mục đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lấy các mục của trang hiện tại
  const currentSensors = sensors.slice(indexOfFirstItem, indexOfLastItem);

  // Đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center">Lỗi: {error}</div>;
  }

  return (
    <div className="flex h-[100%] flex-col justify-center p-3">
      <div className="flex h-full w-full max-w-screen-2xl flex-col rounded-lg border bg-white p-6 shadow-lg">
        <div className="flex-grow overflow-auto">
          {sensors.length === 0 ? (
            <div className="text-center">Chưa có dữ liệu!</div>
          ) : (
            <table className="w-full border-separate overflow-hidden rounded-lg border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="w-10 border border-gray-300 px-4 py-2">STT</th>
                  <th className="border border-gray-300 px-4 py-2">Hình ảnh</th>
                  <th className="border border-gray-300 px-4 py-2">Tên</th>
                  <th className="border border-gray-300 px-4 py-2">Mô tả</th>
                  <th className="border border-gray-300 px-4 py-2">
                    Luồng dữ liệu
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentSensors.map((sensor, index) => (
                  <tr
                    key={sensor.id}
                    className="bg-white transition duration-200 ease-in-out hover:bg-gray-100"
                  >
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {index + 1 + (currentPage - 1) * itemsPerPage}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <img
                        src={Sensor}
                        alt={sensor.name}
                        className="mx-auto h-16 w-16 rounded-full object-cover shadow-md"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                      {sensor.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-600">
                      {sensor.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() =>
                          navigate(
                            `/datastreams/${sensor.id}/${encodeURIComponent(sensor.name)}`,
                          )
                        }
                        className="italic text-blue-900 underline"
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Phân trang */}
        {sensors.length > 0 && (
          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-1 rounded-md px-3 py-1 focus:outline-none ${
                  currentPage === i + 1
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListSensor;
