import { Input } from "antd";

const FilteredThings = ({ setSearchQuery }) => {
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Input
      placeholder="Lọc thiết bị..."
      onChange={handleSearch}
      className="search-input w-60 border-2 border-orange-600 py-2 pl-5"
    />
  );
};

export default FilteredThings;
