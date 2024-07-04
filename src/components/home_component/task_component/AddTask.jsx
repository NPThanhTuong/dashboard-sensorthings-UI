import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { request } from "@/utils/request";
import { useAuth } from "@/context/AuthContext";
import { Switch, message } from "antd";
import Cookies from "js-cookie";
import { renderIcon, colorConfig } from "@/config/IconControlConfig";
import { darkBackgroundClasses } from "@/config/AddTaskConfig";

import "@public/styles/add-task.css";

// Import các context và hook cần thiết
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

const AddTask = () => {
  const { thingId } = useParams();
  const [actuators, setActuators] = useState([]);
  const [taskingParameters, setTaskingParameters] = useState({});
  const [loading, setLoading] = useState(true);
  const [modes, setModes] = useState({});
  const { token } = useAuth();

  const { isDarkMode } = useTheme(); // Lấy trạng thái dark mode từ context

  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại từ context
  const translations = useTranslations(language); // Lấy các bản dịch tương ứng với ngôn ngữ

  const [loaded, setLoaded] = useState(false); // State để kiểm tra dữ liệu đã tải xong chưa

  useEffect(() => {
    const fetchActuators = async () => {
      try {
        const response = await request.get(
          `/get/things(${thingId})/actuator?top=all`,
          {
            headers: {
              token: token,
            },
          },
        );
        if (Array.isArray(response.data)) {
          setActuators(response.data);
          const initialParameters = {};
          const initialModes = JSON.parse(localStorage.getItem("modes")) || {};
          response.data.forEach((actuator) => {
            initialParameters[actuator.id] =
              actuator.controlState === 1 ? 0 : actuator.controlState;
            if (!initialModes[actuator.id]) {
              initialModes[actuator.id] = "Manual";
            }
          });
          setTaskingParameters(initialParameters);
          setModes(initialModes);
          setLoaded(true); // Cập nhật state loaded sau khi dữ liệu đã tải xong
        } else {
          message.error(translations["Invalid actuator data"]);
          console.error("Invalid actuator data:", response.data);
        }
      } catch (error) {
        message.error(translations["Failed to fetch actuators"]);
        console.error("Error fetching actuators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActuators();
  }, [thingId, token, translations]);

  const handleSwitchChange = async (actuatorId, checked) => {
    const newTaskingParameters = {
      ...taskingParameters,
      [actuatorId]: checked ? -1 : 0,
    };
    setTaskingParameters(newTaskingParameters);

    try {
      const response = await request.post(
        "/post/task",
        {
          taskingParameters: newTaskingParameters[actuatorId],
          thing_id: parseInt(thingId),
          actuator_id: actuatorId,
          token,
        },
        {
          headers: {
            token: token,
          },
        },
      );
      if (response.status !== 201) {
        message.error(translations["Operation failed"]);
      }
    } catch (error) {
      message.error(translations["Operation failed"]);
      console.error("Operation error:", error);
    }
  };

  const handleModeChange = (actuatorId, mode) => {
    const newModes = {
      ...modes,
      [actuatorId]: mode,
    };
    setModes(newModes);
    localStorage.setItem("modes", JSON.stringify(newModes)); // Lưu modes vào localStorage
  };

  const handleInputChange = (actuatorId, value) => {
    const newTaskingParameters = {
      ...taskingParameters,
      [actuatorId]: value,
    };
    setTaskingParameters(newTaskingParameters);
  };

  useEffect(() => {
    Cookies.set("taskingParameters", JSON.stringify(taskingParameters), {
      expires: 2,
    });
  }, [taskingParameters]);

  if (!translations) {
    return null;
  }

  // Render chỉ khi dữ liệu đã tải xong và có actuators
  return (
    <>
      {actuators.length > 0 && (
        <section
          className={`${loaded ? "rounded-2xl" : ""} my-4 h-full w-full rounded-2xl p-6 ${
            isDarkMode ? "dark:bg-darkPrimary dark:text-white" : "bg-white"
          }`}
        >
          <h1
            className="-mt-4 mb-2 text-center text-xl font-bold"
            style={{
              fontFamily: "Roboto",
              visibility: loaded ? "visible" : "hidden", // Hiển thị tiêu đề khi dữ liệu đã tải xong
            }}
          >
            {translations["Điều khiển"]}
          </h1>
          <div
            className={`flex h-full w-full items-center justify-start rounded-2xl p-4 ${
              isDarkMode ? "dark:bg-darkSecondary dark:text-white" : "bg-white"
            }`}
          >
            <div className="flex flex-wrap justify-start">
              {actuators?.map((actuator) => {
                const colors = colorConfig[actuator.name] || {};
                const darkBackground =
                  darkBackgroundClasses[actuator.name] ||
                  darkBackgroundClasses.default;
                const isChecked = taskingParameters[actuator.id] === -1;
                return (
                  <div
                    key={actuator.id}
                    className={`m-2 rounded-bl-none rounded-br-2xl rounded-tl-none rounded-tr-2xl border p-6 shadow-lg ${
                      isDarkMode
                        ? "dark:border-darkPrimary dark:bg-darkSecondary"
                        : ""
                    }`}
                    style={{
                      flex: "1 0 21%",
                      width: "250px",
                      height: "220px",
                      maxHeight: "220px",
                      maxWidth: "250px",
                      minHeight: "220px",
                      minWidth: "250px",
                      marginTop: "20px",
                      marginRight: "20px",
                      marginLeft: "10px",
                      margin: "0 auto",
                      backgroundImage: isDarkMode
                        ? darkBackground
                        : colors.bgColor,
                      borderColor: colors.borderColor,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: "5%",
                        backgroundColor: colors.borderColor,
                      }}
                    ></div>
                    <div className="flex flex-col items-center ">
                      <div
                        className="flex items-center text-lg font-bold"
                        style={{ fontFamily: "Roboto", width: "100%" }}
                      >
                        <div
                          style={{
                            flex: "1",
                            display: "flex",
                            marginLeft: "10px",
                            justifyContent: "flex-start",
                          }}
                        >
                          {renderIcon(actuator.name)}
                        </div>
                        <div
                          style={{
                            flex: "1",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <span className="ml-2">{actuator.name}</span>
                        </div>
                      </div>

                      {modes[actuator.id] === "Manual" ? (
                        <div className="my-8 flex items-center justify-center">
                          <Switch
                            checked={isChecked}
                            onChange={(checked) =>
                              handleSwitchChange(actuator.id, checked)
                            }
                            checkedChildren={translations["On"]}
                            unCheckedChildren={translations["Off"]}
                            className="bg-red-500"
                            style={{
                              backgroundColor: isChecked
                                ? colors.borderColor
                                : "#C0C0C0",
                            }}
                          />
                        </div>
                      ) : (
                        <div className="my-8 flex items-center justify-center">
                          <span className="mr-2">{translations["Value"]}</span>
                          <input
                            type="number"
                            value={taskingParameters[actuator.id]}
                            onChange={(e) =>
                              handleInputChange(actuator.id, e.target.value)
                            }
                            className="hide-number-input-arrows p-1"
                            style={{
                              width: "40%",
                              backgroundColor: colors.inputBgColor,
                              borderColor: colors.inputBorderColor,
                            }}
                          />
                        </div>
                      )}
                      <div className="mt-4 flex items-end">
                        <select
                          value={modes[actuator.id]}
                          onChange={(e) =>
                            handleModeChange(actuator.id, e.target.value)
                          }
                          className="custom-select w-36 rounded p-1 text-white"
                          style={{ backgroundColor: colors.selectColor }}
                        >
                          <option
                            value="Manual"
                            className="bg-white text-black"
                          >
                            {translations["Manual"]}
                          </option>
                          <option value="Auto" className="bg-white text-black">
                            {translations["Auto"]}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AddTask;
