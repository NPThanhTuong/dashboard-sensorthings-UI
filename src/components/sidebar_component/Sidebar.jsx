import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { LuMonitorSpeaker } from "react-icons/lu";
import { SiOpenstreetmap } from "react-icons/si";
import { AiOutlineLineChart } from "react-icons/ai";

import { useAuth } from "@/context/AuthContext";
import avatar from "@public/images/user-avatar.jpg";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const linkClasses = (path) =>
    `flex items-center justify-start pl-5 h-12 rounded-md transition-colors duration-200 ease-in-out ${
      location.pathname === path
        ? "bg-blue-800 text-white"
        : "text-gray-700 hover:bg-blue-100 hover:text-blue-500"
    }`;

  return (
    <div className="flex h-screen flex-col bg-white shadow-lg">
      <Link
        to={"/thong-tin-nguoi-dung"}
        className="mx-4 my-6 flex flex-col items-center justify-start"
      >
        <img
          src={avatar}
          alt={user?.message.displayname}
          className="h-12 w-12 rounded-full object-cover"
        />
        <p className="text-2xl font-semibold">{user?.message.displayname}</p>
      </Link>
      <div className="my-2 border-b"></div>
      <div className="mx-4 flex flex-col space-y-2">
        <Link to="/" className={linkClasses("/")}>
          <IoHomeOutline className="text-xl" />
          <span className="text-md ml-3 font-medium">Trang chủ</span>
        </Link>

        <Link to="/quan-sat" className={linkClasses("/quan-sat")}>
          <LuMonitorSpeaker className="text-xl" />
          <span className="text-md ml-3 font-medium">Quan sát</span>
        </Link>

        <Link to="/ban-do" className={linkClasses("/ban-do")}>
          <SiOpenstreetmap className="text-xl" />
          <span className="text-md ml-3 font-medium">Bản đồ</span>
        </Link>

        <Link
          to="/bieu-do-do-am-dat"
          className={linkClasses("/bieu-do-do-am-dat")}
        >
          <AiOutlineLineChart className="text-xl" />
          <span className="text-md ml-3 font-medium">Thống kê</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
