import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { IoHomeOutline } from "react-icons/io5";
import { RiRemoteControlLine } from "react-icons/ri";
import { LuMonitorSpeaker } from "react-icons/lu";
import { SiOpenstreetmap } from "react-icons/si";
import { IoMdLogOut } from "react-icons/io";
import { toast } from "react-toastify";

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
    <div className="w-full">
      <div className="mx-auto my-5 text-center text-xl font-bold">
        <span className="rounded-full border p-3">{token}</span>
      </div>
      <div className="border-white-900 border-b-2"></div>
      <div className="flex flex-col items-center">
        <div className="my-10 flex w-full flex-col items-center">
          <Link
            to="/"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border bg-white p-1 text-black ${location.pathname === "/" ? "bg-sky-700 text-white" : ""}`}
          >
            <IoHomeOutline className="size-5" />
            <span className="text-lg font-semibold">Trang chủ</span>
          </Link>
          <Link
            to="/dieu-khien"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border bg-white p-1 text-black ${location.pathname === "/dieu-khien" ? "bg-sky-700 text-white" : ""}`}
          >
            <RiRemoteControlLine className="size-5" />
            <span className="text-lg font-semibold">Điều khiển</span>
          </Link>
          <Link
            to="/quan-sat"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border bg-white p-1 text-black ${location.pathname === "/quan-sat" ? "bg-sky-700 text-white" : ""}`}
          >
            <LuMonitorSpeaker className="size-5" />
            <span className="text-lg font-semibold">Quan sát</span>
          </Link>
          <Link
            to="/ban-do"
            className={`flex w-full max-w-sm items-center justify-start gap-1 border bg-white p-1 text-black ${location.pathname === "/ban-do" ? "bg-sky-700 text-white" : ""}`}
          >
            <SiOpenstreetmap className="size-5" />
            <span className="text-lg font-semibold">Bản đồ</span>
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
  );
};

export default Sidebar;
