import { Link } from "react-router-dom";

import { IoHomeOutline } from "react-icons/io5";
import { RiRemoteControlLine } from "react-icons/ri";
import { LuMonitorSpeaker } from "react-icons/lu";
import { SiOpenstreetmap } from "react-icons/si";
import { IoMdLogOut } from "react-icons/io";

const Sidebar = () => {
  return (
    <div className="w-full">
      <div className="mx-auto my-5 text-center text-xl font-bold">
        <img src="" alt="tai khoan" className="rounded-full border p-3" />
      </div>
      <div className="border-white-900 border-b-4"></div>
      <div className="flex flex-col items-center">
        <div className="my-10 flex w-full flex-col items-center">
          <Link
            to="/"
            className="flex w-full max-w-sm items-center justify-start gap-1 border bg-blue-100 p-1 text-black hover:bg-sky-700 hover:text-white"
          >
            <IoHomeOutline className="size-5" />
            <span className="text-lg font-semibold">Trang chủ</span>
          </Link>
          <Link
            to="/dieu-khien"
            className="flex w-full max-w-sm items-center justify-start gap-1 border bg-green-100 p-1 text-black hover:bg-sky-700 hover:text-white"
          >
            <RiRemoteControlLine className="size-5" />
            <span className="text-lg font-semibold">Điều khiển</span>
          </Link>
          <Link
            to="/quan-sat"
            className="flex w-full max-w-sm items-center justify-start gap-1 border bg-yellow-100 p-1 text-black hover:bg-sky-700 hover:text-white"
          >
            <LuMonitorSpeaker className="size-5" />
            <span className="text-lg font-semibold">Quan sát</span>
          </Link>
          <Link
            to="/ban-do"
            className="flex w-full max-w-sm items-center justify-start gap-1 border bg-pink-100 p-1 text-black hover:bg-sky-700 hover:text-white"
          >
            <SiOpenstreetmap className="size-5" />
            <span className="text-lg font-semibold">Bản đồ</span>
          </Link>
        </div>
        <button className="flex w-full max-w-sm items-center justify-start gap-1 border bg-white p-1 text-red-600 hover:bg-red-700 hover:text-white">
          <IoMdLogOut className="size-5" />
          <span className="text-lg font-semibold">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
