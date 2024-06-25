import { Table, Alert, Pagination } from "antd";
import { useTheme } from "@/context/ThemeContext";
import { useTranslations } from "@/config/useTranslations"; // Import hook useTranslations
import { useLanguage } from "@/context/LanguageContext"; // Import hook useLanguage

const DataStreamTable = ({
  dataStreams,
  sensors,
  error,
  currentPage,
  itemsPerPage,
  indexOfFirstItem,
  paginate,
}) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage(); // Get the current language
  const translations = useTranslations(language); // Get the translations

  if (!translations) {
    return null;
  }
  const columns = [
    {
      title: translations["STT"], // Translated text
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => indexOfFirstItem + index + 1,
    },
    {
      title: translations["Quan trắc"], // Translated text
      dataIndex: "name",
      key: "name",
    },
    {
      title: translations["Cảm biến"], // Translated text
      dataIndex: "sensor",
      key: "sensor",
      render: (_, record) => sensors[record.id]?.name,
    },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentDataStreams = dataStreams.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <div
      className={`w-full rounded-2xl p-4 shadow-md ${
        isDarkMode
          ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
          : "bg-white"
      }`}
    >
      {error && (
        <Alert
          message={`${translations["Lỗi"]}: ${error.message}`}
          type="error"
          showIcon
        />
      )}
      {!error && dataStreams.length === 0 && (
        <Alert
          message={translations["Chưa có dữ liệu!"]}
          type="info"
          showIcon
        />
      )}
      {!error && dataStreams.length > 0 && (
        <div className="flex h-full flex-col">
          <div className="flex-grow overflow-auto">
            <Table
              dataSource={currentDataStreams.map((dataStream, index) => ({
                ...dataStream,
                key: dataStream.id,
                index: indexOfFirstItem + index + 1,
              }))}
              columns={columns}
              pagination={false}
              rowKey="id"
              className={isDarkMode ? "dark-mode-table" : ""}
            />
          </div>
          <div
            className={`my-4 border-b-2 border-gray-300 ${
              isDarkMode ? "dark:border-b-2 dark:border-gray-300" : ""
            }`}
          ></div>
          <div className="flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={dataStreams.length}
              onChange={paginate}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataStreamTable;
