import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Form, Switch, message, Skeleton } from "antd";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";

const AddTask = ({ actuator }) => {
  const { thingId } = useParams();
  const [taskingParameters, setTaskingParameters] = useState(() => {
    const storedState = parseInt(Cookies.get("taskingParameters")) || 0;
    return storedState === 1 ? -1 : 0;
  });
  const [isSwitched, setIsSwitched] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loading, setLoading] = useState(true);
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
        } finally {
          setLoading(false);
        }
      };

      saveTask();
    } else {
      setInitialLoad(false);
    }
  }, [taskingParameters, initialLoad, isSwitched, thingId, token, actuator.id]);

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
    <div className="flex h-full flex-col items-center justify-center">
      {loading ? (
        <Skeleton.Button active size="large" />
      ) : (
        <Switch
          checked={taskingParameters === -1}
          onChange={(checked) => {
            setTaskingParameters(checked ? -1 : 0);
            setIsSwitched(true);
          }}
          checkedChildren="On"
          unCheckedChildren="Off"
        />
      )}
    </div>
  );
};

export default AddTask;
