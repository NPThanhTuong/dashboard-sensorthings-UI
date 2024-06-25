import { DatePicker, Button } from "antd";
import "@public/styles/calendar.css";
const { RangePicker } = DatePicker;
import { useTheme } from "@/context/ThemeContext";

const ObservationTableHeader = ({
  handleChangeDate,
  isErrorDatePicker,
  exportToExcel,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
      <h4 className="mb-2 text-lg font-bold md:mb-0 md:mr-4">
        Dữ liệu quan trắc
      </h4>
      <div className="flex flex-col items-center md:flex-row">
        <RangePicker
          showTime
          onChange={handleChangeDate}
          status={isErrorDatePicker ? "error" : ""}
          className={`w-full max-w-xs ${
            isDarkMode
              ? "dark-placeholder dark:border-darkPrimary dark:bg-darkSecondary dark:text-white dark:shadow-sm dark:shadow-white"
              : "bg-white"
          }`}
          getPopupContainer={(trigger) => trigger.parentElement}
          dropdownClassName={isDarkMode ? "dark-theme-datepicker" : ""}
        />
        <Button
          type="primary"
          onClick={exportToExcel}
          className="ml-2 dark:shadow-sm dark:shadow-white"
        >
          Xuất Excel
        </Button>
      </div>
    </div>
  );
};

export default ObservationTableHeader;
