import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const FilteredThings = ({ setSearchQuery }) => {
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Input
      placeholder="Tìm kiếm..."
      onChange={handleSearch}
      prefix={<SearchOutlined />}
      className="search-input w-72 rounded-3xl border-2 py-2 pl-5"
    />
  );
};
//
export default FilteredThings;
