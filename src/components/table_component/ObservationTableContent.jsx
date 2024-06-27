import React, { useState } from "react";
import { Empty, Table, Pagination } from "antd";
import dayjs from "dayjs";
import { useTheme } from "@/context/ThemeContext";
import "@public/styles/observation-table-content.css";

import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

const ObservationTableContent = ({
  loading,
  handleObservation,
  observationName,
  capitalizeFirstLetter,
  lowerizeFirstLetter,
}) => {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const { language } = useLanguage();
  const translations = useTranslations(language);

  if (!translations) {
    return null;
  }

  if (loading || !handleObservation || handleObservation.length === 0) {
    return <Empty description={translations["Không có dữ liệu"]} />;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const dataToShow = handleObservation.slice(startIndex, endIndex);

  const columns = [
    {
      title: translations["STT"],
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => startIndex + index + 1,
    },
    {
      title: translations["Thời gian"],
      dataIndex: "time",
      key: "time",
      render: (text, record) =>
        dayjs(record.result[0]["time"]).format("HH:mm:ss DD/MM/YYYY"),
    },
    {
      title: capitalizeFirstLetter(observationName),
      dataIndex: "observationValue",
      key: "observationValue",
      render: (text, record) =>
        `${record.result[0][lowerizeFirstLetter(observationName)]?.value}${record.result[0][lowerizeFirstLetter(observationName)]?.unit.replace(/\(|\)/g, "").replace(/\s+/g, "").trim()}`,
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-6 flex justify-center">
      <div className="min-h-[60vh] w-full max-w-screen-2xl py-4">
        <div
          className={`min-h-[60vh] rounded-lg p-6 shadow-md transition-colors ${
            isDarkMode ? "bg-darkSecondary text-white" : ""
          }`}
        >
          <Table
            dataSource={dataToShow}
            columns={columns}
            pagination={false}
            className={isDarkMode ? "dark-mode-table" : ""}
          />
          <Pagination
            current={currentPage}
            total={handleObservation.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `${translations["Hiển thị"]} ${range[0]}-${range[1]} ${translations["trong"]} ${total} ${translations["mục"]}`
            }
            className={`mt-4 flex justify-end `}
          />
        </div>
      </div>
    </div>
  );
};

export default ObservationTableContent;
