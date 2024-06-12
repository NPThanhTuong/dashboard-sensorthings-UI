import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Form, Switch, message } from "antd";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";

const AddTask = ({ actuator }) => {
  const { thingId } = useParams();
  const [taskingParameters, setTaskingParameters] = useState(() => {
    const storedState = parseInt(Cookies.get("taskingParameters")) || 0;
    return storedState === 1 ? -1 : 0;
  });
  const [isSwitched, setIsSwitched] = useState(false); // Trạng thái công tắc đã được chuyển đổi
  const [initialLoad, setInitialLoad] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!initialLoad) {
      const saveTask = async () => {
        try {
          const response = await axios.post("/api/post/task", {
            taskingParameters: taskingParameters === -1 ? 1 : 0,
            thing_id: parseInt(thingId),
            actuator_id: actuator.id,
            token,
          });
          if (response.status === 201) {
            // Hiển thị thông báo chỉ khi công tắc được chuyển đổi
            if (isSwitched) {
              message.success(
                `Đã ${taskingParameters === -1 ? "bật" : "tắt"} `,
              );
            }
          } else {
            message.error("Bật tắt thất bại");
          }
        } catch (error) {
          message.error("Bật tắt thất bại");
          console.error("Lỗi bật tắt:", error);
        }
      };

      saveTask();
    } else {
      setInitialLoad(false);
    }
  }, [taskingParameters, initialLoad, isSwitched]);

  useEffect(() => {
    if (actuator.controlState !== undefined && initialLoad) {
      setTaskingParameters(actuator.controlState === 1 ? -1 : 0);
    }
  }, [actuator.controlState, initialLoad]);

  useEffect(() => {
    Cookies.set("taskingParameters", taskingParameters === -1 ? 1 : 0, {
      expires: 7,
    });
  }, [taskingParameters]);

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-4 shadow-md">
      <Form layout="vertical">
        <Form.Item label="Bật/tắt" required>
          <Switch
            checked={taskingParameters === -1}
            onChange={(checked) => {
              setTaskingParameters(checked ? -1 : 0);
              setIsSwitched(true);
            }}
            checkedChildren="On"
            unCheckedChildren="Off"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTask;
