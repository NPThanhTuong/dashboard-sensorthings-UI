import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

const FilteredThings = ({ setSearchQuery }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  if (!translations) {
    return null; // Hoặc có thể trả về một spinner hay một thành phần báo hiệu đang loading
  }

  return (
    <Input
      placeholder={translations["Tìm kiếm"]}
      onChange={handleSearch}
      prefix={<SearchOutlined />}
      className={`search-input w-72 rounded-3xl border-2 py-2 pl-5 ${
        isDarkMode
          ? "dark:border-darkPrimary dark:bg-darkSecondary dark:text-white dark:shadow-sm dark:shadow-white"
          : "border-primary bg-white"
      }`}
    />
  );
};

export default FilteredThings;
