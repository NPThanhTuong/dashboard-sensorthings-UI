import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import nhaMay from "../../../../public/images/nha-may.jpg";

const ListThings = () => {
  const { token } = useAuth();
  const [things, setThings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng mục trên mỗi trang
  const navigate = useNavigate();

  const fetchThings = async () => {
    try {
      const response = await axios("/api/getThings", {
        headers: {
          token: token,
        },
      });

      if (Array.isArray(response.data.data)) {
        const thingsData = response.data.data;
        setThings(thingsData);
      } else {
        setThings([]);
      }

      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThings(); // Lấy danh sách Things ban đầu

    const interval = setInterval(() => {
      fetchThings(); // Lấy danh sách Things định kỳ
    }, 3000); // Sau 3s lấy dữ liệu mới

    return () => clearInterval(interval);
  }, [token]);

  // Tính số lượng trang
  const totalPages = Math.ceil(things.length / itemsPerPage);

  // Lấy chỉ số của mục đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Lấy các mục của trang hiện tại
  const currentThings = things.slice(indexOfFirstItem, indexOfLastItem);

  // Đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center">Lỗi: {error.message}</div>;
  }

  return (
    <div className="flex h-[100%] flex-col justify-center p-4">
      <div className="flex h-full w-full max-w-screen-2xl flex-col rounded-lg border bg-white p-6 shadow-lg">
        <div className="flex-grow overflow-auto">
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
              {currentThings?.map((thing, index) => (
                <tr
                  key={thing.id}
                  className="bg-white transition duration-200 ease-in-out hover:bg-gray-100"
                >
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1 + (currentPage - 1) * itemsPerPage}
                  </td>
                  {/* <td className="border border-gray-300 px-4 py-2 text-center">
                    <img
                      src={thing.avt_image}
                      alt={thing.name}
                      className="mx-auto h-16 w-16 rounded-full object-cover shadow-md"
                    />
                  </td> */}
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <img
                      src={nhaMay}
                      alt={thing.name}
                      className="mx-auto h-16 w-16 rounded-full object-cover shadow-md"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                    {thing.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-gray-600">
                    {thing.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        navigate(
                          `/datastreams/${thing.id}/${encodeURIComponent(thing.name)}`,
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
        </div>
        {/* Phân trang */}
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
      </div>
    </div>
  );
};

export default ListThings;
