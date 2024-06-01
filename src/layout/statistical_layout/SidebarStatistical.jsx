import { Link, useLocation } from "react-router-dom";

const SidebarStatistical = () => {
  const location = useLocation();

  return (
    <div className="mx-auto my-1 flex h-full w-full rounded-lg bg-white p-4 text-lg shadow">
      <Link
        to="/bieu-do-do-am-dat"
        className={`mx-2 flex-1 px-4 py-2 text-center font-medium transition-all duration-300 ${
          location.pathname === "/bieu-do-do-am-dat"
            ? "rounded bg-blue-800 text-white"
            : "text-gray-700 hover:text-blue-800"
        }`}
      >
        Độ ẩm đất
      </Link>
      <div className="mx-1 border-r-2 border-gray-200"></div>
      <Link
        to="/bieu-do-cuong-do-anh-sang"
        className={`mx-2 flex-1 px-4 py-2 text-center font-medium transition-all duration-300 ${
          location.pathname === "/bieu-do-cuong-do-anh-sang"
            ? "rounded bg-blue-800 text-white"
            : "text-gray-700 hover:text-blue-800"
        }`}
      >
        Cường độ ánh sáng
      </Link>
    </div>
  );
};

export default SidebarStatistical;
