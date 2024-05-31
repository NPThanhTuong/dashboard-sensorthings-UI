import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

import { IoHomeOutline } from "react-icons/io5";
import { LuMonitorSpeaker } from "react-icons/lu";
import { SiOpenstreetmap } from "react-icons/si";
import { IoMdLogOut } from "react-icons/io";
import { AiOutlineLineChart } from "react-icons/ai";

import avatar from "../../../public/images/nha-may.jpg";

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

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto my-5">
        <img
          src={avatar}
          alt="avatar"
          className="h-20 w-20 rounded-full object-cover"
        />
      </div>
      <div className="border-white-900 my-4 border-b-2"></div>
      <div className="flex flex-col items-center">
        <div className="my-10 flex w-full flex-col items-center">
          <Link
            to="/"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border p-1 px-5 py-4 text-black ${location.pathname === "/" ? "bg-sky-700 text-white" : ""}`}
          >
            <IoHomeOutline className="size-7" />
            <span className="pl-3 text-lg font-semibold">Trang chủ</span>
          </Link>

          <Link
            to="/quan-sat"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border p-1 px-5 py-4 text-black ${location.pathname === "/quan-sat" ? "bg-sky-700 text-white" : ""}`}
          >
            <LuMonitorSpeaker className="size-5" />
            <span className="pl-3 text-lg font-semibold">Quan sát</span>
          </Link>
          <Link
            to="/ban-do"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border p-1 px-5 py-4 text-black ${location.pathname === "/ban-do" ? "bg-sky-700 text-white" : ""}`}
          >
            <SiOpenstreetmap className="size-5" />
            <span className="pl-3 text-lg font-semibold">Bản đồ</span>
          </Link>
          <Link
            to="/bieu-do-do-am-dat"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border p-1 px-5 py-4 text-black ${location.pathname === "/bieu-do-do-am-dat" || location.pathname === "/bieu-do-cuong-do-anh-sang" ? "bg-sky-700 text-white" : ""}`}
          >
            <AiOutlineLineChart className="size-5" />
            <span className="pl-3 text-lg font-semibold">Thống kê</span>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="mt-auto flex w-full max-w-sm items-center justify-start gap-1 border bg-red-500 p-1 px-5 py-4 text-white"
        >
          <IoMdLogOut className="size-5" />
          <span className="pl-3 text-lg font-semibold">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
