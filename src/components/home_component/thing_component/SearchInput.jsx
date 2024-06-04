import { Link, useLocation } from "react-router-dom";
import { Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

const SidebarHome = () => {
  const location = useLocation();

  return (
    <div className="px-3">
      <div className="flex h-full w-full rounded-lg bg-white px-4 py-2 text-lg shadow">
        <div className="flex w-full items-center justify-between">
          <div>
            {(location.pathname === "/" ||
              location.pathname.startsWith("/them-thing")) && (
              <Link
                to="/them-thing"
                className="flex items-center justify-center rounded bg-blue-600 px-4 py-1 text-center font-medium text-white transition-all duration-300 hover:bg-blue-700"
              >
                <PlusOutlined className="mr-1" /> Thêm Thing
              </Link>
            )}
          </div>
          <div className="ml-2 flex items-center">
            <Search
              placeholder="Tìm kiếm"
              className="w-64"
              onSearch={(value) => console.log(value)}
              enterButton={<SearchOutlined style={{ marginTop: "-30px" }} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarHome;
