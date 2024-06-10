import { Input } from "antd";

const { Search } = Input;

const SidebarHome = () => {
  return (
    <div className="ml-2 flex items-center">
      <Search
        placeholder="Tìm kiếm"
        className="w-64"
        onSearch={(value) => console.log(value)}
      />
    </div>
  );
};

export default SidebarHome;
