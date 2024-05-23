import { Link, useLocation } from "react-router-dom";

const SidebarStatistical = () => {
  const location = useLocation();

  return (
    <div className="flex h-full bg-white text-lg">
      <Link
        to="/bieu-do-do-am-dat"
        className={`px-2 py-1 font-medium ${
          location.pathname === "/bieu-do-do-am-dat"
            ? "text-blue-800 underline"
            : "text-gray-700 hover:bg-sky-50"
        }`}
      >
        Độ ẩm đất
      </Link>
      <Link
        to="/bieu-do-cuong-do-anh-sang"
        className={`px-2 py-1 font-medium ${
          location.pathname === "/bieu-do-cuong-do-anh-sang"
            ? "text-blue-800 underline"
            : "text-gray-700 hover:bg-sky-50"
        }`}
      >
        Cường độ ánh sáng
      </Link>
    </div>
  );
};

export default SidebarStatistical;
