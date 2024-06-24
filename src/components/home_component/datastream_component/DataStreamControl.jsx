import React from "react";
import { Select, Button } from "antd";
import ImportData from "@/components/import_data_component/ImportData";
import ObservationChart from "@/components/chart_component/ObservationChart";
import ObservationTable from "@/components/table_component/ObservationTable";

import { useTheme } from "@/context/ThemeContext";
import "@public/styles/data-stream-control.css";

import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

const { Option } = Select;
const { Group: ButtonGroup } = Button;

const DataStreamControl = ({
  dataStreams,
  selectedDataStream,
  handleDataStreamChange,
  activeView,
  toggleView,
  toggleAddingData,
  isAddingData,
}) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);

  const buttonStyle = (isActive) => ({
    backgroundColor: isActive
      ? isDarkMode
        ? "#0A84FF"
        : "#00BB00"
      : "transparent",
    color: isActive ? "#fff" : isDarkMode ? "#fff" : "#000",
    borderColor: isDarkMode ? "#555" : "#00BB00",
  });

  if (!translations) {
    return null;
  }

  return (
    <section className="my-4">
      <div
        className={`my-4 flex flex-col md:flex-row md:items-center md:justify-between ${
          isDarkMode ? "dark:bg-darkSecondary dark:text-white" : ""
        }`}
      >
        <div className="mb-4 w-full md:mb-0 md:mr-4 md:w-auto">
          <Select
            value={selectedDataStream}
            onChange={handleDataStreamChange}
            className={`h-10 w-full rounded-2xl focus:border-primary focus:outline-none ${
              isDarkMode ? "select-dark-mode" : "bg-white focus:border-primary"
            }`}
            placeholder="Chọn dòng dữ liệu"
            dropdownClassName={isDarkMode ? "select-dark-mode" : ""}
          >
            {dataStreams.map((stream) => (
              <Option key={stream.id} value={stream.id}>
                {stream.name}
              </Option>
            ))}
          </Select>
        </div>

        <ButtonGroup
          className={`flex w-full flex-wrap gap-4 md:w-auto ${
            isDarkMode ? "" : "border-primary"
          }`}
        >
          <Button
            onClick={toggleAddingData}
            className="h-10 w-full px-6 py-2 md:w-auto"
            style={buttonStyle(activeView === "addData")}
          >
            {translations["Thêm dữ liệu"]}
          </Button>

          <Button
            onClick={() => toggleView("chart")}
            className="h-10 w-full px-4 py-2 md:w-auto"
            style={buttonStyle(activeView === "chart")}
          >
            {translations["Dữ liệu biểu đồ"]}
          </Button>

          <Button
            onClick={() => toggleView("table")}
            className="h-10 w-full px-6 py-2 md:w-auto"
            style={buttonStyle(activeView === "table")}
          >
            {translations["Dữ liệu bảng"]}
          </Button>
        </ButtonGroup>
      </div>

      <div className="mt-4">
        {activeView === "addData" && <ImportData />}
        {activeView === "chart" && selectedDataStream && (
          <ObservationChart datastreamId={selectedDataStream} />
        )}
        {activeView === "table" && selectedDataStream && (
          <ObservationTable datastreamId={selectedDataStream} />
        )}
      </div>
    </section>
  );
};

export default DataStreamControl;
