import { Link, useLocation } from "react-router-dom";

const SidebarHome = () => {
  const location = useLocation();

  return (
    <div className="mx-4 my-1">
      <div className="flex h-full w-full rounded-lg bg-white p-4 text-lg shadow">
        <div className="mx-1 border-l-2 border-gray-200"></div>{" "}
        <Link
          to="/"
          className={`flex-1 px-4 py-2 text-center font-medium transition-all duration-300 ${
            location.pathname === "/"
              ? "bg-blue-800 text-white"
              : "text-gray-700 hover:text-blue-800"
          }`}
        >
          Danh sách Thing
        </Link>
        <div className="mx-1 border-r-2 border-gray-200"></div>{" "}
        {(location.pathname === "/" ||
          location.pathname.startsWith("/them-thing")) && (
          <>
            <Link
              to="/them-thing"
              className="w-[150px] bg-blue-800 px-4 py-2 text-center font-medium text-white transition-all duration-300 hover:bg-blue-700"
            >
              Thêm Thing
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default SidebarHome;
