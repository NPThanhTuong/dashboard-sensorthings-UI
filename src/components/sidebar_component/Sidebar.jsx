import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import { IoHomeOutline } from "react-icons/io5";
import { RiRemoteControlLine } from "react-icons/ri";
import { LuMonitorSpeaker } from "react-icons/lu";
import { SiOpenstreetmap } from "react-icons/si";
import { IoMdLogOut } from "react-icons/io";
import { AiOutlineLineChart } from "react-icons/ai";

import "./sidebar.css";
import { FiMenu } from "react-icons/fi";
import  { useState } from "react";

const Sidebar = () => {
  const { token, clearToken } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      clearToken(token);
      navigate("/dang-nhap");
    } catch (error) {
      toast(error);
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    console.log('check');
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
    <FiMenu  className="icon-menu" onClick={toggleSidebar}/>
      <div className="box">
      <div className="mx-auto my-5 text-center text-xl font-bold">
        {/* đoạn này người tổng hợp sẽ tổng hợp với code của người làm phần UserInfor và Update UserInfor để chuyển trang */}
        <Link to="/user-infor">
        
        <div className="flex items-center rounded-full border p-3">
          <img
            src="https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-de-thuong-don-gian-010.jpg"
            alt="Avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span>Tên</span>
        </div>
          </Link>
      </div>
      <div className="border-white-900 border-b-2"></div>
      <div className="flex flex-col items-center">
        <div className="my-10 flex w-full flex-col items-center">
          <Link
            to="/"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border p-1 text-black ${location.pathname === "/" ? "bg-sky-700 text-white" : ""}`}
          >
            <IoHomeOutline className="size-5" />
            <span className="text-lg font-semibold">Trang chủ</span>
          </Link>
          <Link
            to="/dieu-khien"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border p-1 text-black ${location.pathname === "/dieu-khien" ? "bg-sky-700 text-white" : ""}`}
          >
            <RiRemoteControlLine className="size-5" />
            <span className="text-lg font-semibold">Điều khiển</span>
          </Link>
          <Link
            to="/quan-sat"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border p-1 text-black ${location.pathname === "/quan-sat" ? "bg-sky-700 text-white" : ""}`}
          >
            <LuMonitorSpeaker className="size-5" />
            <span className="text-lg font-semibold">Quan sát</span>
          </Link>
          <Link
            to="/ban-do"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border p-1 text-black ${location.pathname === "/ban-do" ? "bg-sky-700 text-white" : ""}`}
          >
            <SiOpenstreetmap className="size-5" />
            <span className="text-lg font-semibold">Bản đồ</span>
          </Link>
          <Link
            to="/bieu-do-do-am-dat"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border p-1 text-black ${location.pathname === "/bieu-do-do-am-dat" || location.pathname === "/bieu-do-cuong-do-anh-sang" ? "bg-sky-700 text-white" : ""}`}
          >
            <AiOutlineLineChart className="size-5" />
            <span className="text-lg font-semibold">Thống kê</span>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full max-w-sm items-center justify-start gap-1 border bg-white p-1 text-red-600 hover:bg-red-700 hover:text-white"
        >
          <IoMdLogOut className="size-5" />
          <span className="text-lg font-semibold">Đăng xuất</span>
        </button>
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
