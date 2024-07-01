import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { request } from "@/utils/request";
import { Switch, message, Card } from "antd";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";
import { renderIcon } from "@/config/IconControlConfig";

const AddTask = () => {
  const { thingId } = useParams();
  const [actuators, setActuators] = useState([]);
  const [taskingParameters, setTaskingParameters] = useState({});
  const [autoMode, setAutoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

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
          response.data.forEach((actuator) => {
            initialParameters[actuator.id] =
              actuator.controlState === 1 ? 0 : actuator.controlState;
          });
          setTaskingParameters(initialParameters);
          setAutoMode(
            response.data.some((actuator) => actuator.controlState === 1),
          );
        } else {
          message.error("Invalid actuator data");
          console.error("Invalid actuator data:", response.data);
        }
      } catch (error) {
        message.error("Failed to fetch actuators");
        console.error("Error fetching actuators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActuators();
  }, [thingId, token]);

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
      if (response.status === 201) {
        message.success(
          `Đã ${newTaskingParameters[actuatorId] === -1 ? "mở" : "tắt"}`,
        );
      } else {
        message.error("Thao tác thất bại");
      }
    } catch (error) {
      message.error("Thao tác thất bại");
      console.error("Lỗi thao tác:", error);
    }
  };

  const handleAutoModeChange = async (checked) => {
    setAutoMode(checked);

    try {
      const response = await request.post(
        "/post/task",
        {
          taskingParameters: checked ? 1 : 0,
          thing_id: parseInt(thingId),
          actuator_id: null,
          token,
        },
        {
          headers: {
            token: token,
          },
        },
      );
      if (response.status === 201) {
        message.success(`Chế độ tự động ${checked ? "bật" : "tắt"}`);
      } else {
        message.error("Thao tác thất bại");
      }
    } catch (error) {
      message.error("Thao tác thất bại");
      console.error("Lỗi thao tác:", error);
    }
  };

  useEffect(() => {
    Cookies.set("taskingParameters", JSON.stringify(taskingParameters), {
      expires: 7,
    });
    Cookies.set("autoMode", JSON.stringify(autoMode), {
      expires: 7,
    });
  }, [taskingParameters, autoMode]);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {loading ? (
        <div></div>
      ) : (
        <div className="flex w-full flex-wrap justify-start">
          {actuators.map((actuator) => (
            <Card
              key={actuator.id}
              title={actuator.name}
              style={{ flex: "0 0 16.66%", marginBottom: 16, marginRight: 16 }}
            >
              <div className="flex items-center justify-between">
                {renderIcon(
                  actuator.name,
                  taskingParameters[actuator.id] === -1,
                )}
                <Switch
                  checked={taskingParameters[actuator.id] === -1}
                  onChange={(checked) =>
                    handleSwitchChange(actuator.id, checked)
                  }
                  checkedChildren="On"
                  unCheckedChildren="Off"
                  disabled={autoMode}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddTask;
