import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { LuMonitorSpeaker } from "react-icons/lu";
import { SiOpenstreetmap } from "react-icons/si";
import { AiOutlineLineChart } from "react-icons/ai";
import { IoMdLogOut } from "react-icons/io";

import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const Sidebar = () => {
  const location = useLocation();
  const { clearToken } = useAuth();
  const navigate = useNavigate();
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);

  const handleLogout = () => {
    clearToken();
    navigate("/dang-nhap");
  };

  return (
    <div className="flex h-dvh w-64 flex-col bg-white shadow-lg">
      <Link
        to={"/thong-tin-nguoi-dung"}
        className="mx-4 my-4 flex items-center"
      >
        <img
          src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-de-thuong-don-gian-010.jpg"
          alt="Avatar"
          className="h-12 w-12 rounded-full object-cover"
        />
        <span className="ml-4 text-lg font-semibold">Tên</span>
      </Link>
      <div className="my-2 border-b"></div>
      <div className="flex flex-col">
        <div className="mx-4">
          <button
            onClick={() => setIsHomeMenuOpen(!isHomeMenuOpen)}
            className={`flex w-full items-center justify-between rounded-lg p-3 transition-colors ${
              location.pathname === "/"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-blue-100"
            }`}
          >
            <Link to={"/"} className="flex items-center">
              <IoHomeOutline className="text-xl" />
              <span className="text-md ml-3 font-medium">Trang chủ</span>
            </Link>
            {isHomeMenuOpen ? (
              <FaChevronDown className="text-xl" />
            ) : (
              <FaChevronRight className="text-xl" />
            )}
          </button>
          {isHomeMenuOpen && (
            <div className="ml-8 flex flex-col">
              <Link
                to="/danh-sach-thing"
                className={`flex items-center rounded-lg p-3 transition-colors ${
                  location.pathname === "/danh-sach-thing"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                }`}
              >
                <span className="text-md font-medium">Danh sách Thing</span>
              </Link>
              <Link
                to="/danh-sach-sensor"
                className={`flex items-center rounded-lg p-3 transition-colors ${
                  location.pathname === "/danh-sach-sensor"
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-blue-100"
                }`}
              >
                <span className="text-md font-medium">Danh sách Sensor</span>
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/quan-sat"
          className={`mx-4 mb-2 flex items-center rounded-lg p-3 transition-colors ${
            location.pathname === "/quan-sat"
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100"
          }`}
        >
          <LuMonitorSpeaker className="text-xl" />
          <span className="text-md ml-3 font-medium">Quan sát</span>
        </Link>

        <Link
          to="/ban-do"
          className={`mx-4 mb-2 flex items-center rounded-lg p-3 transition-colors ${
            location.pathname === "/ban-do"
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100"
          }`}
        >
          <SiOpenstreetmap className="text-xl" />
          <span className="text-md ml-3 font-medium">Bản đồ</span>
        </Link>

        <Link
          to="/bieu-do-do-am-dat"
          className={`mx-4 mb-2 flex items-center rounded-lg p-3 transition-colors ${
            location.pathname === "/bieu-do-do-am-dat" ||
            location.pathname === "/bieu-do-cuong-do-anh-sang"
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-blue-100"
          }`}
        >
          <AiOutlineLineChart className="text-xl" />
          <span className="text-md ml-3 font-medium">Thống kê</span>
        </Link>
      </div>
      <div className="mx-4 mt-auto p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center rounded-lg bg-red-500 p-3 text-white transition-colors hover:bg-red-600"
        >
          <IoMdLogOut className="text-xl" />
          <span className="text-md ml-3 font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
