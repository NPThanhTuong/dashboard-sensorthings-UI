import { useState, useEffect } from "react";
import { request } from "@/utils/request";
import { Table, Alert, Pagination, message, Switch } from "antd";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";

import { useTheme } from "@/context/ThemeContext";
import { useTranslations } from "@/config/useTranslations"; // Import hook useTranslations
import { useLanguage } from "@/context/LanguageContext"; // Import hook useLanguage
import "@public/styles/observation-table-content.css";

const FetchTaskData = ({ thingId }) => {
  const { isDarkMode } = useTheme(); // Lấy trạng thái chế độ tối
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại
  const translations = useTranslations(language); // Lấy các bản dịch tương ứng với ngôn ngữ
  const [tasksData, setTasksData] = useState([]); // Trạng thái lưu trữ dữ liệu nhiệm vụ
  const [error, setError] = useState(null); // Trạng thái lưu trữ lỗi
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái lưu trữ trang hiện tại
  const itemsPerPage = 10; // Số mục trên mỗi trang
  const { token } = useAuth(); // Lấy token xác thực người dùng

  // useEffect để gọi API lấy dữ liệu actuator
  useEffect(() => {
    const fetchActuatorsData = async () => {
      try {
        const response = await request.get(
          `/get/things(${thingId})/actuator?top=all`,
          {
            headers: {
              token: token,
            },
          },
        );
        const actuators = response.data;
        const storedStates = JSON.parse(Cookies.get("actuatorStates") || "{}");

        // Lưu trữ dữ liệu actuator sau khi lấy về và gán trạng thái điều khiển
        const actuatorsWithData = actuators.map((actuator) => ({
          actuatorId: actuator.id,
          actuatorName: actuator.name,
          taskId: null,
          taskingParameters: null,
          controlState:
            storedStates[actuator.id] !== undefined
              ? storedStates[actuator.id]
              : actuator.controlState,
        }));

        setTasksData(actuatorsWithData); // Cập nhật dữ liệu nhiệm vụ
      } catch (error) {
        console.error("Error fetching actuators data:", error);
        setError(error); // Cập nhật trạng thái lỗi
      }
    };

    fetchActuatorsData(); // Gọi hàm lấy dữ liệu actuator
  }, [thingId, token]);

  // Hàm thay đổi trang hiện tại
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm thay đổi trạng thái Switch của actuator
  const handleSwitchChange = async (checked, actuator) => {
    const newControlState = checked ? -1 : 0;

    try {
      setTasksData((prevTasks) =>
        prevTasks.map((task) =>
          task.actuatorId === actuator.actuatorId
            ? { ...task, controlState: newControlState }
            : task,
        ),
      );

      const updatedControlStates = {
        ...JSON.parse(Cookies.get("actuatorStates") || "{}"),
        [actuator.actuatorId]: newControlState,
      };
      Cookies.set("actuatorStates", JSON.stringify(updatedControlStates), {
        expires: 7,
      });

      const response = await request.post("/post/task", {
        taskingParameters: newControlState,
        thing_id: parseInt(thingId),
        actuator_id: actuator.actuatorId,
        token,
      });

      if (response.status === 201) {
        message.success(
          `${translations["Đã"]} ${checked ? translations["bật"] : translations["tắt"]} ${actuator.actuatorName}`,
        );
      } else {
        message.error(translations["Failed to toggle actuator"]);
        setTasksData((prevTasks) =>
          prevTasks.map((task) =>
            task.actuatorId === actuator.actuatorId
              ? { ...task, controlState: checked ? 0 : -1 }
              : task,
          ),
        );
      }
    } catch (error) {
      message.error(translations["Failed to toggle actuator"]);
      console.error("Toggle error:", error);
      setTasksData((prevTasks) =>
        prevTasks.map((task) =>
          task.actuatorId === actuator.actuatorId
            ? { ...task, controlState: checked ? 0 : -1 }
            : task,
        ),
      );
    }
  };

  if (!translations) {
    return null; // Nếu chưa có bản dịch thì không render gì cả
  }

  const columns = [
    {
      title: translations["Thiết bị"], // Văn bản dịch
      dataIndex: "actuatorName",
      key: "actuatorName",
      render: (text, record) => record.actuatorName || "-", // Hiển thị dấu gạch ngang nếu không có dữ liệu
    },
    {
      title: translations["Trạng thái"], // Văn bản dịch
      dataIndex: "controlState",
      key: "controlState",
      render: (controlState) => {
        switch (controlState) {
          case -1:
            return translations["Đang bật"];
          case 0:
            return translations["Đang tắt"];
          case 1:
            return translations["Tự động"];
          default:
            return translations["Không xác định"];
        }
      },
    },
    {
      title: translations["Điều khiển"], // Văn bản dịch
      key: "control",
      render: (text, record) => (
        <Switch
          checked={record.controlState === -1}
          onChange={(checked) => handleSwitchChange(checked, record)}
          checkedChildren="On"
          unCheckedChildren="Off"
        />
      ),
    },
  ];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasksData.slice(indexOfFirstItem, indexOfLastItem); // Lấy dữ liệu của trang hiện tại

  return (
    <div
      className={`rounded-2xl p-4 ${
        isDarkMode
          ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
          : "bg-white"
      }`}
    >
      {error && (
        <Alert
          message={`${translations["Error"]}: ${error.message}`}
          type="error"
          showIcon
          description={translations["Chưa có nhiệm vụ điều khiển"]}
          className={isDarkMode ? "dark-mode-alert" : ""}
        />
      )}
      {!error && tasksData.length === 0 && (
        <Alert
          message={translations["Chưa có nhiệm vụ điều khiển"]}
          type="info"
          showIcon
          className={isDarkMode ? "dark-mode-alert" : ""}
        />
      )}

      {tasksData.length > 0 && (
        <>
          <Table
            dataSource={currentTasks}
            columns={columns}
            pagination={false}
            rowKey="actuatorId"
            className={`${isDarkMode ? "dark-mode-table" : ""} `}
          />
          <div
            className={`my-4 border-b-2 border-gray-300 ${
              isDarkMode ? "dark:border-b-2 dark:border-gray-300" : ""
            }`}
          ></div>
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={tasksData.length}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FetchTaskData;
